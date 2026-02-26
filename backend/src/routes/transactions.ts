// routes/transactions.ts
import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
} from "../controllers/transactionController.js";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const router = Router();

/**
 * Middleware to authenticate requests using JWT
 */
interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

/* ======================================================
   Routes
====================================================== */

// Create a new transaction
router.post("/", authenticate, createTransaction);

// Get all transactions for the authenticated user
router.get("/", authenticate, getTransactions);

// Update a transaction by ID
router.put("/:id", authenticate, updateTransaction);

// Delete a transaction by ID
router.delete("/:id", authenticate, deleteTransaction);

// Get transaction summary
router.get("/summary", authenticate, getSummary);

export default router;