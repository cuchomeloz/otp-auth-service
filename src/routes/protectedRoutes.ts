import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/me", authenticateToken, (req, res) => {
  const user = (req as any).user;
  res.status(200).json({
    message: "Ruta protegida accedida correctamente",
    user,
  });
});

export default router;
