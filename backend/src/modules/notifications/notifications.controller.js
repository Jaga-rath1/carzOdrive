const svc = require('./notifications.service');
const { success } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');

const getUserNotifications = asyncHandler(async (req, res) => {
  const result = await svc.getUserNotifications(req.user.id, req.query);
  res.json({
    success: true,
    data: result.notifications,
    pagination: result.pagination,
    unreadCount: result.unreadCount,
  });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await svc.markRead(req.params.id, req.user.id);
  success(res, notification, 'Notification marked as read');
});

const markAllRead = asyncHandler(async (req, res) => {
  const result = await svc.markAllRead(req.user.id);
  success(res, result, 'All notifications marked as read');
});

const deleteNotification = asyncHandler(async (req, res) => {
  await svc.deleteNotification(req.params.id, req.user.id);
  success(res, null, 'Notification deleted');
});

module.exports = { getUserNotifications, markRead, markAllRead, deleteNotification };
