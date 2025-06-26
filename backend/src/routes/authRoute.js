import express from 'express';
import {login, logout, onboard, signUp, updateProfile } from '../controller/authController.js';
import { protectRoute } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);

router.post('/onboarding',protectRoute, onboard);
router.post('/update-profile',protectRoute,updateProfile);

export default router;
