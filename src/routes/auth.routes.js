import { Router } from "express";
import {
  register,
  login,
  logout,
  verifyToken,
  profile,
  updateUserPassword,
  updateUserPoints,
  getUsers,
  statusChange,
  changeToJugde,
  getUserByEmail,
  isPrivate,
  getUserPrivateStatus,
  getUser
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.put("/", statusChange);
router.get("/verify", verifyToken);
router.get("/", getUsers);
router.get("/profile", authRequired, profile);
router.put("/points/:id", authRequired, updateUserPoints);
router.put("/account/password", authRequired, updateUserPassword);
router.put("/torneo", authRequired, changeToJugde);
router.get("/getUserByEmail", authRequired, getUserByEmail);
router.put("/isPrivate", authRequired, isPrivate);
router.get('/user/private/:email', authRequired, getUserPrivateStatus);
router.get('/users/:id', authRequired, getUser);

export default router;
