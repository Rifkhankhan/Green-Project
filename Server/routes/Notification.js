const express = require('express');
var router = express.Router();
var notificationController = require('../Controllers/Notification');

router.post('/create', notificationController.createNotification);
router.delete('/delete/:notificationId', notificationController.deleteNotification);
router.patch('/update/:notificationId', notificationController.updateNotification);
router.get('/notification/:notificationId', notificationController.getNotification);
router.post('/:userId', notificationController.getNotificationByUserId);
router.get('/', notificationController.getAllNotifications);

module.exports = router;
