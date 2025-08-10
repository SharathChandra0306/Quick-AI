import express from 'express';
import { auth } from '../middlewares/auth.js';
import {
    getCommunityPosts,
    createCommunityPost,
    likeCommunityPost,
    addComment,
    getPostComments,
    getFeaturedPosts,
    getUserPosts
} from '../controllers/communityControllers.js';

const communityRouter = express.Router();

// Community endpoints
communityRouter.get('/posts', auth, getCommunityPosts);
communityRouter.post('/posts', auth, createCommunityPost);
communityRouter.post('/posts/:id/like', auth, likeCommunityPost);
communityRouter.get('/posts/:id/comments', auth, getPostComments);
communityRouter.post('/posts/:id/comments', auth, addComment);
communityRouter.get('/featured', auth, getFeaturedPosts);
communityRouter.get('/my-posts', auth, getUserPosts);

export default communityRouter;
