import { handleCivicChat } from '../services/aiChat.service.js';

export async function handleAiChatRequest(req, res, next) {
  try {
    const { message, context } = req.body;
    const result = await handleCivicChat(message || '', req.user, context);
    res.status(200).json({
      success: true,
      data: result,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}
