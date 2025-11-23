import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import {
  sendProgressReport,
  sendWeeklySummary,
  sendTestSMS,
  updateSMSSettings,
  getSMSSettings
} from '../controllers/sms.controller.js';

const router = express.Router();

// All SMS routes require authentication
router.use(requireAuth);

// Send progress report SMS (admin only)
router.post('/progress-report', requireAdmin, sendProgressReport);

// Send weekly summary SMS (admin only)
router.post('/weekly-summary', requireAdmin, sendWeeklySummary);

// Test SMS functionality (admin only)
router.post('/test', requireAdmin, sendTestSMS);

// Update SMS settings for a user (admin only)
router.put('/settings/:userId', requireAdmin, updateSMSSettings);

// Get SMS settings for a user (admin only)
router.get('/settings/:userId', requireAdmin, getSMSSettings);

export default router;
