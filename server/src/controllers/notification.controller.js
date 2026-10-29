import * as notificationService from '../services/notification.service.js';

export async function handleGetNotifications(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await notificationService.getUserNotifications(req.user._id, limit);
    res.status(200).json({
      success: true,
      data: result.notifications,
      unreadCount: result.unreadCount,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleMarkRead(req, res, next) {
  try {
    const notification = await notificationService.markNotificationAsRead(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: notification,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleMarkAllRead(req, res, next) {
  try {
    await notificationService.markAllNotificationsAsRead(req.user._id);
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}
