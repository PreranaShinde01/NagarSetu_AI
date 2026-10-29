import { Router } from 'express';
import { handleAiChatRequest } from '../controllers/aiChat.controller.js';

const router = Router();

router.post('/chat', handleAiChatRequest);

export default router;
