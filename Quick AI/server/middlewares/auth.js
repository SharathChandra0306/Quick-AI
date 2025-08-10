import { clerkClient } from "@clerk/express";


// Middleware to check userId and if user has premium plan
export const auth = async (req, res, next) => {
    try {
        const { userId, plan } = req.auth;
        const hasPremiumPlan = plan === 'premium';
        const user = await clerkClient.users.getUser(userId);

        if (!hasPremiumPlan && user.privateMetadata.free_usage) {
            req.free_usage = user.privateMetadata.free_usage;
        } else {
            await clerkClient.users.updateUserMetadata(userId, { privateMetadata: { free_usage: 0 } });
            req.free_usage = 0;
        }
        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}