import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(authValidation.registerSchema),
  AuthController.register
);

router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  AuthController.login
);

export default router;
