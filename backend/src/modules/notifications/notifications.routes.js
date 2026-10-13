const express = require('express');
const controller = require('./notifications.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

// GET /notifications — get own paginated notifications
router.get('/', authenticate, controller.getUserNotifications);

// POST /notifications/read-all — mark all notifications as read (must come before /:id)
router.post('/read-all', authenticate, controller.markAllRead);

// POST /notifications/:id/read — mark single notification as read
router.post('/:id/read', authenticate, controller.markRead);

// DELETE /notifications/:id — delete own notification
router.delete('/:id', authenticate, controller.deleteNotification);

module.exports = router;
