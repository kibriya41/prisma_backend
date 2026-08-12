import { Router } from "express";
import { CategoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";

const router = Router();

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(categoryValidation.createCategorySchema),
  CategoryController.createCategory
);

router.get("/", CategoryController.getAllCategories);

router.get("/:id", CategoryController.getCategoryById);

router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(categoryValidation.updateCategorySchema),
  CategoryController.updateCategory
);

router.delete("/:id", auth("ADMIN"), CategoryController.softDeleteCategory);

export default router;
