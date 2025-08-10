import express from 'express';
import { auth } from '../middlewares/auth.js';
import { 
    generateArticle,
    generateBlogTitles,
    generateImages,
    removeBackground,
    removeObject,
    reviewResume,
    getDashboardData,
    getUserCreations,
    resetUsage
} from '../controllers/aiControllers.js';

const aiRouter = express.Router();

// AI Generation endpoints
aiRouter.post("/generate-article", auth, generateArticle);
aiRouter.post("/generate-blog-titles", auth, generateBlogTitles);
aiRouter.post("/generate-images", auth, generateImages);
aiRouter.post("/remove-background", auth, removeBackground);
aiRouter.post("/remove-object", auth, removeObject);
aiRouter.post("/review-resume", auth, reviewResume);

// Dashboard and user data endpoints
aiRouter.get("/dashboard", auth, getDashboardData);
aiRouter.get("/creations", auth, getUserCreations);

// Development only endpoints
aiRouter.post("/reset-usage", auth, resetUsage);

export default aiRouter;