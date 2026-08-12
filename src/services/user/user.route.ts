import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = Router();

router.get("/", auth("ADMIN"), UserController.getAllUsers);

router.get("/:id", auth("ADMIN", "USER"), UserController.getUserById);

router.patch(
  "/:id",
  auth("ADMIN", "USER"),
  validateRequest(userValidation.updateUserSchema),
  UserController.updateUser
);

router.delete("/:id", auth("ADMIN"), UserController.softDeleteUser);

export default router;
