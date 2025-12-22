import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/task.controller.js";

const router = Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.get('/:id', authMiddleware, getTaskById);
router.patch("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;