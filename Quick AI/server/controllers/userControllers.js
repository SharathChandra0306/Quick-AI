import sql from '../config/db.js';
import { clerkClient } from '@clerk/express';

// Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.auth;

        // Get user from database
        let user = await sql`SELECT * FROM users WHERE clerk_id = ${userId}`;

        if (user.length === 0) {
            // Create user if doesn't exist
            const clerkUser = await clerkClient.users.getUser(userId);
            await sql`
                INSERT INTO users (clerk_id, email, full_name, plan, free_usage)
                VALUES (${userId}, ${clerkUser.primaryEmailAddress?.emailAddress}, ${clerkUser.fullName}, 'free', 0)
            `;
            user = await sql`SELECT * FROM users WHERE clerk_id = ${userId}`;
        }

        // Get Clerk user data
        const clerkUser = await clerkClient.users.getUser(userId);

        res.json({
            success: true,
            data: {
                ...user[0],
                imageUrl: clerkUser.imageUrl,
                emailAddress: clerkUser.primaryEmailAddress?.emailAddress,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName
            }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { full_name } = req.body;

        // Update in database
        await sql`
            UPDATE users 
            SET full_name = ${full_name}, updated_at = CURRENT_TIMESTAMP
            WHERE clerk_id = ${userId}
        `;

        // Update in Clerk
        await clerkClient.users.updateUser(userId, {
            firstName: full_name.split(' ')[0],
            lastName: full_name.split(' ').slice(1).join(' ')
        });

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Upgrade User to Premium
export const upgradeUser = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { plan = 'premium' } = req.body;

        // Update user plan in database
        await sql`
            UPDATE users 
            SET plan = ${plan}, updated_at = CURRENT_TIMESTAMP
            WHERE clerk_id = ${userId}
        `;

        // Update in Clerk metadata
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                plan: plan
            }
        });

        res.json({
            success: true,
            message: 'Account upgraded successfully',
            plan: plan
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get User Stats
export const getUserStats = async (req, res) => {
    try {
        const { userId } = req.auth;

        // Get creation stats
        const creationStats = await sql`
            SELECT 
                type,
                COUNT(*) as count,
                DATE(created_at) as date
            FROM creations 
            WHERE user_id = ${userId}
            GROUP BY type, DATE(created_at)
            ORDER BY date DESC
            LIMIT 30
        `;

        // Get total stats
        const totalStats = await sql`
            SELECT 
                COUNT(*) as total_creations,
                COUNT(DISTINCT type) as types_used,
                MIN(created_at) as first_creation,
                MAX(created_at) as last_creation
            FROM creations 
            WHERE user_id = ${userId}
        `;

        // Get user info
        const userInfo = await sql`
            SELECT plan, free_usage, total_generations, created_at
            FROM users 
            WHERE clerk_id = ${userId}
        `;

        res.json({
            success: true,
            data: {
                user: userInfo[0],
                creationStats: creationStats,
                totalStats: totalStats[0]
            }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete User Account
export const deleteUserAccount = async (req, res) => {
    try {
        const { userId } = req.auth;

        // Delete user data from database
        await sql`DELETE FROM community_comments WHERE user_id = ${userId}`;
        await sql`DELETE FROM community_likes WHERE user_id = ${userId}`;
        await sql`DELETE FROM community_posts WHERE user_id = ${userId}`;
        await sql`DELETE FROM creations WHERE user_id = ${userId}`;
        await sql`DELETE FROM users WHERE clerk_id = ${userId}`;

        // Delete from Clerk
        await clerkClient.users.deleteUser(userId);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
