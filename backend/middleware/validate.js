import { validationResult } from 'express-validator';

// Runs after express-validator chains; collects errors into a single response
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    throw new Error(message);
  }
  next();
};
