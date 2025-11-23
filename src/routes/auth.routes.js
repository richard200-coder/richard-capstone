import { Router } from 'express';
import { register, login, logout, me, updateMe, getAllUsers, updateUser, deleteUser } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.put('/me', requireAuth, updateMe);

// Admin routes
router.get('/users', requireAuth, requireAdmin, getAllUsers);
router.put('/users/:id', requireAuth, requireAdmin, updateUser);
router.delete('/users/:id', requireAuth, requireAdmin, deleteUser);

export default router;
