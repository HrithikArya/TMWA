import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(verifyToken, requireRole('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints (requires admin role)
 */

/**
 * @swagger
 * /admin/tasks:
 *   get:
 *     summary: Get all tasks across all users (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, completed]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter tasks by a specific user ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, dueDate, priority]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: All tasks fetched
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/tasks', adminController.getAllTasks);

/**
 * @swagger
 * /admin/tasks/{id}:
 *   delete:
 *     summary: Delete any task regardless of ownership (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted by admin
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Task not found
 */
router.delete('/tasks/:id', adminController.deleteAnyTask);

export default router;
