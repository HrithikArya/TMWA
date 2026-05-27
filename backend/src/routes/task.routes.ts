import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { createTaskValidator, updateTaskValidator } from '../validators/task.validator';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints (authenticated users)
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks for the authenticated user (paginated, filterable)
 *     tags: [Tasks]
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
 *           maximum: 50
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, completed]
 *           default: all
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, dueDate, priority]
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', taskController.getTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
router.post('/', createTaskValidator, validate, taskController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task fetched
 *       403:
 *         description: Not task owner
 *       404:
 *         description: Task not found
 */
router.get('/:id', taskController.getTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       403:
 *         description: Not task owner
 *       404:
 *         description: Task not found
 */
router.put('/:id', updateTaskValidator, validate, taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task (owner only)
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       403:
 *         description: Not task owner
 *       404:
 *         description: Task not found
 */
router.delete('/:id', taskController.deleteTask);

/**
 * @swagger
 * /tasks/{id}/toggle:
 *   patch:
 *     summary: Toggle task status between pending and completed
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task status toggled
 *       403:
 *         description: Not task owner
 *       404:
 *         description: Task not found
 */
router.patch('/:id/toggle', taskController.toggleStatus);

export default router;
