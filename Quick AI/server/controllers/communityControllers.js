import sql from '../config/db.js';
import { clerkClient } from '@clerk/express';

// Get Community Posts
export const getCommunityPosts = async (req, res) => {
    try {
        const { type, page = 1, limit = 10, sort = 'recent' } = req.query;
        const offset = (page - 1) * limit;

        let orderBy;
        switch (sort) {
            case 'popular':
                orderBy = sql`ORDER BY likes_count DESC, created_at DESC`;
                break;
            case 'trending':
                orderBy = sql`ORDER BY (likes_count + comments_count) DESC, created_at DESC`;
                break;
            default:
                orderBy = sql`ORDER BY created_at DESC`;
        }

        let whereClause = sql`WHERE 1=1`;
        if (type && type !== 'all') {
            whereClause = sql`WHERE type = ${type}`;
        }

        const posts = await sql`
            SELECT 
                cp.*,
                u.full_name,
                u.email
            FROM community_posts cp
            LEFT JOIN users u ON cp.user_id = u.clerk_id
            ${whereClause}
            ${orderBy}
            LIMIT ${limit} OFFSET ${offset}
        `;

        // Get user details from Clerk for posts
        const postsWithUserData = await Promise.all(
            posts.map(async (post) => {
                try {
                    const user = await clerkClient.users.getUser(post.user_id);
                    return {
                        ...post,
                        user: {
                            id: user.id,
                            fullName: user.fullName,
                            imageUrl: user.imageUrl,
                            email: user.primaryEmailAddress?.emailAddress
                        }
                    };
                } catch (error) {
                    return {
                        ...post,
                        user: {
                            id: post.user_id,
                            fullName: post.full_name || 'Anonymous',
                            imageUrl: null,
                            email: post.email
                        }
                    };
                }
            })
        );

        const totalCount = await sql`
            SELECT COUNT(*) as total 
            FROM community_posts
            ${whereClause}
        `;

        res.json({
            success: true,
            data: {
                posts: postsWithUserData,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: totalCount[0]?.total || 0,
                    hasMore: (page * limit) < (totalCount[0]?.total || 0)
                }
            }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Create Community Post
export const createCommunityPost = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { title, content, type, tags = [] } = req.body;

        if (!title || !content || !type) {
            return res.json({ success: false, message: 'Title, content, and type are required' });
        }

        const result = await sql`
            INSERT INTO community_posts (user_id, title, content, type, tags)
            VALUES (${userId}, ${title}, ${content}, ${type}, ${tags})
            RETURNING *
        `;

        res.json({
            success: true,
            data: result[0],
            message: 'Post created successfully'
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Like/Unlike Community Post
export const likeCommunityPost = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { id } = req.params;

        // Check if user already liked this post
        const existingLike = await sql`
            SELECT * FROM community_likes 
            WHERE user_id = ${userId} AND post_id = ${id}
        `;

        if (existingLike.length > 0) {
            // Unlike the post
            await sql`
                DELETE FROM community_likes 
                WHERE user_id = ${userId} AND post_id = ${id}
            `;
            await sql`
                UPDATE community_posts 
                SET likes_count = likes_count - 1 
                WHERE id = ${id}
            `;
            res.json({ success: true, action: 'unliked' });
        } else {
            // Like the post
            await sql`
                INSERT INTO community_likes (user_id, post_id)
                VALUES (${userId}, ${id})
            `;
            await sql`
                UPDATE community_posts 
                SET likes_count = likes_count + 1 
                WHERE id = ${id}
            `;
            res.json({ success: true, action: 'liked' });
        }

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Post Comments
export const getPostComments = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const comments = await sql`
            SELECT * FROM community_comments 
            WHERE post_id = ${id}
            ORDER BY created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        // Get user details for comments
        const commentsWithUserData = await Promise.all(
            comments.map(async (comment) => {
                try {
                    const user = await clerkClient.users.getUser(comment.user_id);
                    return {
                        ...comment,
                        user: {
                            id: user.id,
                            fullName: user.fullName,
                            imageUrl: user.imageUrl
                        }
                    };
                } catch (error) {
                    return {
                        ...comment,
                        user: {
                            id: comment.user_id,
                            fullName: 'Anonymous',
                            imageUrl: null
                        }
                    };
                }
            })
        );

        res.json({
            success: true,
            data: commentsWithUserData
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Add Comment
export const addComment = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.json({ success: false, message: 'Comment content is required' });
        }

        const result = await sql`
            INSERT INTO community_comments (user_id, post_id, content)
            VALUES (${userId}, ${id}, ${content})
            RETURNING *
        `;

        // Update comments count
        await sql`
            UPDATE community_posts 
            SET comments_count = comments_count + 1 
            WHERE id = ${id}
        `;

        res.json({
            success: true,
            data: result[0],
            message: 'Comment added successfully'
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Featured Posts
export const getFeaturedPosts = async (req, res) => {
    try {
        const posts = await sql`
            SELECT 
                cp.*,
                u.full_name,
                u.email
            FROM community_posts cp
            LEFT JOIN users u ON cp.user_id = u.clerk_id
            WHERE cp.is_featured = true
            ORDER BY cp.created_at DESC
            LIMIT 5
        `;

        res.json({
            success: true,
            data: posts
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get User Posts
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const posts = await sql`
            SELECT * FROM community_posts 
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const totalCount = await sql`
            SELECT COUNT(*) as total 
            FROM community_posts 
            WHERE user_id = ${userId}
        `;

        res.json({
            success: true,
            data: {
                posts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: totalCount[0]?.total || 0,
                    hasMore: (page * limit) < (totalCount[0]?.total || 0)
                }
            }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
