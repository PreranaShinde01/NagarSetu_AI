import Notification from '../models/Notification.js';

export async function getUserNotifications(userId, limit = 20) {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  const unreadCount = await Notification.countDocuments({ userId, read: false });

  return { notifications, unreadCount };
}

export async function markNotificationAsRead(id, userId) {
  return await Notification.findOneAndUpdate(
    { _id: id, userId },
    { read: true },
    { new: true }
  );
}

export async function markAllNotificationsAsRead(userId) {
  return await Notification.updateMany({ userId, read: false }, { read: true });
}
