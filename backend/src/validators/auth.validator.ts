import { body } from 'express-validator';

export const signupValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2–50 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number'),
];

export const loginValidator = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];
