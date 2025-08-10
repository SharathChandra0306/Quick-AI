import express from 'express';
import { auth } from '../middlewares/auth.js';
import {
    getUserProfile,
    updateUserProfile,
    upgradeUser,
    getUserStats,
    deleteUserAccount
} from '../controllers/userControllers.js';

const userRouter = express.Router();

// User management endpoints
userRouter.get('/profile', auth, getUserProfile);
userRouter.put('/profile', auth, updateUserProfile);
userRouter.post('/upgrade', auth, upgradeUser);
userRouter.get('/stats', auth, getUserStats);
userRouter.delete('/account', auth, deleteUserAccount);

export default userRouter;
