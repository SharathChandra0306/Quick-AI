import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Helper function to check and update usage
const checkAndUpdateUsage = async (plan, free_usage, userId, usageCount = 1) => {
    // In development mode, bypass usage limits
    if (process.env.NODE_ENV === 'development') {
        console.log(`Development mode: Bypassing usage check for user ${userId}`);
        return { success: true };
    }
    
    // Increased free usage limit to 100 for testing purposes
    if (plan !== 'premium' && free_usage >= 100) {
        return { success: false, message: "You have reached your free usage limit. Please upgrade to premium." };
    }

    if (plan !== 'premium') {
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                free_usage: free_usage + usageCount
            }
        });
    }
    return { success: true };
};

// Generate Article
export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        const usageCheck = await checkAndUpdateUsage(plan, free_usage, userId);
        if (!usageCheck.success) {
            return res.json(usageCheck);
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: `Write a detailed article about: ${prompt}. The article should be approximately ${length} words long.`,
                },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices?.[0]?.message?.content || "";
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Generate Blog Titles
export const generateBlogTitles = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { topic, count = 5 } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        const usageCheck = await checkAndUpdateUsage(plan, free_usage, userId);
        if (!usageCheck.success) {
            return res.json(usageCheck);
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: `Generate ${count} catchy and SEO-friendly blog titles about: ${topic}. Make them engaging and clickable. Format them as a numbered list.`,
                },
            ],
            temperature: 0.8,
            max_tokens: 300,
        });

        const content = response.choices?.[0]?.message?.content || "";
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${topic}, ${content}, 'blog-titles')`;

        res.json({ success: true, content, titles: content.split('\n').filter(line => line.trim()) });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Generate Images (AI-powered descriptions for image generation)
export const generateImages = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { prompt, style = "realistic", size = "1024x1024", count = 1 } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        const usageCheck = await checkAndUpdateUsage(plan, free_usage, userId, 2); // Images cost more
        if (!usageCheck.success) {
            return res.json(usageCheck);
        }

        // Enhanced prompt engineering for better accuracy
        let enhancedPrompt = prompt;
        
        // Add style-specific modifiers
        switch(style.toLowerCase()) {
            case 'realistic':
                enhancedPrompt = `photorealistic, highly detailed, ${prompt}, sharp focus, professional photography, 8k resolution`;
                break;
            case 'anime style':
                enhancedPrompt = `anime style, ${prompt}, beautiful anime art, studio quality, detailed character design`;
                break;
            case 'cartoon style':
                enhancedPrompt = `cartoon style, ${prompt}, colorful, fun, animated style, disney-like quality`;
                break;
            case 'ghibli style':
                enhancedPrompt = `studio ghibli style, ${prompt}, beautiful hand-drawn animation, miyazaki style, magical atmosphere`;
                break;
            case 'cyberpunk style':
                enhancedPrompt = `cyberpunk style, ${prompt}, neon lights, futuristic, sci-fi, digital art, high tech`;
                break;
            case 'fantasy style':
                enhancedPrompt = `fantasy art, ${prompt}, magical, mystical, epic fantasy, detailed fantasy illustration`;
                break;
            case '3d style':
                enhancedPrompt = `3d render, ${prompt}, high quality 3d model, realistic lighting, detailed textures`;
                break;
            case 'pixel art':
                enhancedPrompt = `pixel art style, ${prompt}, retro gaming, 16-bit style, detailed pixel graphics`;
                break;
            case 'portrait style':
                enhancedPrompt = `portrait photography, ${prompt}, professional headshot, studio lighting, high resolution`;
                break;
            default:
                enhancedPrompt = `${prompt}, high quality, detailed, professional`;
        }
        
        // Try multiple image generation services for better results
        const services = [
            {
                name: 'Pollinations',
                url: (prompt) => {
                    const encoded = encodeURIComponent(prompt);
                    return `https://image.pollinations.ai/prompt/${encoded}?width=${size.split('x')[0]}&height=${size.split('x')[1]}&seed=${Date.now()}&model=flux`;
                }
            },
            {
                name: 'Picsum with overlay',
                url: (prompt) => {
                    const encoded = encodeURIComponent(prompt);
                    return `https://api.deepai.org/api/text2img?text=${encoded}`;
                }
            }
        ];
        
        // Use the first service (Pollinations with Flux model for better accuracy)
        const imageUrl = services[0].url(enhancedPrompt);
        
        // Also generate AI description for the image
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: `Create a detailed description of what this AI-generated image should look like based on this prompt: "${prompt}" in ${style} style. Be very specific about the subject, pose, setting, colors, lighting, and composition. Make it sound like a professional art description.`,
                },
            ],
            temperature: 0.7,
            max_tokens: 400,
        });

        const content = response.choices?.[0]?.message?.content || "";
        
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'image')`;

        res.json({ 
            success: true, 
            content, 
            imagePrompts: content,
            imageUrl: imageUrl,
            enhancedPrompt: enhancedPrompt,
            originalPrompt: prompt,
            metadata: { style, size, count, service: services[0].name }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Remove Background (AI-powered background removal suggestions)
export const removeBackground = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { imageDescription, imageUrl } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        const usageCheck = await checkAndUpdateUsage(plan, free_usage, userId, 2);
        if (!usageCheck.success) {
            return res.json(usageCheck);
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: `Provide detailed instructions for removing the background from an image with this description: ${imageDescription}. Include tips for edge detection, color separation, and clean cutout techniques. Also suggest what type of background would work best as a replacement.`,
                },
            ],
            temperature: 0.3,
            max_tokens: 500,
        });

        const content = response.choices?.[0]?.message?.content || "";
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${"Background removal: " + imageDescription}, ${content}, 'remove-background')`;

        res.json({ 
            success: true, 
            content,
            instructions: content,
            originalImage: imageUrl || null
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Remove Object (AI-powered object removal suggestions)
export const removeObject = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { imageDescription, objectToRemove, imageUrl } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        const usageCheck = await checkAndUpdateUsage(plan, free_usage, userId, 2);
        if (!usageCheck.success) {
            return res.json(usageCheck);
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: `Provide detailed instructions for removing "${objectToRemove}" from an image with this description: ${imageDescription}. Include techniques for content-aware fill, cloning, and seamless blending. Suggest how to maintain natural lighting and shadows after removal.`,
                },
            ],
            temperature: 0.3,
            max_tokens: 500,
        });

        const content = response.choices?.[0]?.message?.content || "";
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${"Remove " + objectToRemove + " from: " + imageDescription}, ${content}, 'remove-object')`;

        res.json({ 
            success: true, 
            content,
            instructions: content,
            removedObject: objectToRemove,
            originalImage: imageUrl || null
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Review Resume
export const reviewResume = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { resumeText, jobDescription = "", focusAreas = [] } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        const usageCheck = await checkAndUpdateUsage(plan, free_usage, userId);
        if (!usageCheck.success) {
            return res.json(usageCheck);
        }

        let prompt = `Review this resume and provide detailed feedback:\n\nResume:\n${resumeText}\n\n`;
        
        if (jobDescription) {
            prompt += `Job Description:\n${jobDescription}\n\n`;
            prompt += `Provide specific feedback on how well this resume matches the job requirements, missing skills, and suggestions for improvement.\n\n`;
        }
        
        if (focusAreas.length > 0) {
            prompt += `Focus on these areas: ${focusAreas.join(', ')}\n\n`;
        }
        
        prompt += `Please provide:\n1. Overall rating (1-10)\n2. Strengths\n3. Areas for improvement\n4. Specific suggestions\n5. Formatting recommendations\n6. ATS optimization tips`;

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 1000,
        });

        const content = response.choices?.[0]?.message?.content || "";
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${"Resume Review"}, ${content}, 'resume-review')`;

        res.json({ 
            success: true, 
            content,
            review: content,
            hasJobDescription: !!jobDescription
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Dashboard Data
export const getDashboardData = async (req, res) => {
    try {
        const { userId } = req.auth;
        const plan = req.plan;
        const free_usage = req.free_usage;

        // Get recent creations
        const recentCreations = await sql`
            SELECT type, prompt, content, created_at 
            FROM creations 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC 
            LIMIT 5
        `;

        // Get creation stats
        const stats = await sql`
            SELECT 
                type,
                COUNT(*) as count
            FROM creations 
            WHERE user_id = ${userId}
            GROUP BY type
        `;

        // Get total creations count
        const totalCreations = await sql`
            SELECT COUNT(*) as total 
            FROM creations 
            WHERE user_id = ${userId}
        `;

        res.json({
            success: true,
            data: {
                user: {
                    plan,
                    freeUsage: free_usage,
                    usageLimit: plan === 'premium' ? 'unlimited' : 10,
                    remainingFree: plan === 'premium' ? 'unlimited' : Math.max(0, 10 - free_usage)
                },
                recentCreations: recentCreations,
                stats: stats,
                totalCreations: totalCreations[0]?.total || 0
            }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get User Creations
export const getUserCreations = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { type, page = 1, limit = 10 } = req.query;

        let query = sql`
            SELECT * FROM creations 
            WHERE user_id = ${userId}
        `;

        if (type && type !== 'all') {
            query = sql`
                SELECT * FROM creations 
                WHERE user_id = ${userId} AND type = ${type}
            `;
        }

        const offset = (page - 1) * limit;
        const creations = await sql`
            ${query}
            ORDER BY created_at DESC 
            LIMIT ${limit} OFFSET ${offset}
        `;

        const totalCount = await sql`
            SELECT COUNT(*) as total 
            FROM creations 
            WHERE user_id = ${userId}
            ${type && type !== 'all' ? sql`AND type = ${type}` : sql``}
        `;

        res.json({
            success: true,
            data: {
                creations,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: totalCount[0]?.total || 0,
                    hasMore: (page * limit) < (totalCount[0]?.total || 0)
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Reset user usage (Development only)
export const resetUsage = async (req, res) => {
    try {
        if (process.env.NODE_ENV !== 'development') {
            return res.status(403).json({ success: false, message: "This endpoint is only available in development mode" });
        }

        const { userId } = req.auth;
        
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                free_usage: 0
            }
        });

        res.json({ 
            success: true, 
            message: "Usage count reset successfully",
            newUsage: 0
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};