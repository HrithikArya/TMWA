import { body } from 'express-validator';

export const createTaskValidator = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be under 100 chars'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be under 500 chars'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO date')
    .custom((val: string) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(val) < today) {
        throw new Error('Due date must be today or in the future');
      }
      return true;
    }),
];

export const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be under 100 chars'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be under 500 chars'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage('Status must be pending or completed'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO date'),
];
