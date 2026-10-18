const express = require('express');
const controller = require('../controllers/vendors.controller');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'STAFF_ADMIN'];

// 1. Public / Guest attachment endpoints ("Rent Your Car" & "Rent Your Bike")
router.post('/attach-car', optionalAuth, controller.attachCar);
router.post('/attach-bike', optionalAuth, controller.attachBike);

// 2. Vendor portal endpoints (requires authenticated vendor)
router.get('/my-fleet', authenticate, controller.getMyFleet);

// 3. Admin moderation endpoints
router.get('/submissions', authenticate, authorize(...ADMIN_ROLES), controller.listSubmissions);
router.get('/admin/submissions', authenticate, authorize(...ADMIN_ROLES), controller.listSubmissions);
router.patch('/admin/submissions/:type/:id/approve', authenticate, authorize(...ADMIN_ROLES), controller.approveSubmission);
router.patch('/admin/submissions/:type/:id/reject', authenticate, authorize(...ADMIN_ROLES), controller.rejectSubmission);
router.delete('/admin/submissions/:type/:id', authenticate, authorize(...ADMIN_ROLES), controller.deleteSubmission);
router.put('/admin/submissions/:type/:id', authenticate, authorize(...ADMIN_ROLES), controller.updateSubmission);

module.exports = router;
