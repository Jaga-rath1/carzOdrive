const { Notification } = require('./notifications.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

async function createNotification(userId, type, title, message, data = null) {
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    data,
    isRead: false,
  });
  return notification;
}

async function getUserNotifications(userId, query) {
  const { page, limit, skip } = getPagination(query);
  const filter = { userId };

  if (query.isRead !== undefined) {
    filter.isRead = query.isRead === 'true';
  }
  if (query.type) {
    filter.type = query.type;
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .skip(skip).limit(limit).sort({ createdAt: -1 }),
    Notification.countDocuments(filter),
  ]);

  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  return {
    notifications,
    pagination: buildPaginationMeta(total, page, limit),
    unreadCount,
  };
}

async function markRead(notificationId, userId) {
  const notification = await Notification.findOne({ _id: notificationId, userId });
  if (!notification) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }
  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
  }
  return notification;
}

async function markAllRead(userId) {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
  return { updatedCount: result.modifiedCount };
}

async function deleteNotification(notificationId, userId) {
  const notification = await Notification.findOne({ _id: notificationId, userId });
  if (!notification) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }
  await notification.deleteOne();
}

module.exports = {
  createNotification,
  getUserNotifications,
  markRead,
  markAllRead,
  deleteNotification,
};
