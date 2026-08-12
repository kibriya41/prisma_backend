import { Router } from "express";
import { ProductController } from "./product.controller";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { productValidation } from "./product.validation";

const router = Router();

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(productValidation.createProductSchema),
  ProductController.createProduct
);

router.get("/", ProductController.getAllProducts);

router.get("/:id", ProductController.getProductById);

router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(productValidation.updateProductSchema),
  ProductController.updateProduct
);

router.delete("/:id", auth("ADMIN"), ProductController.softDeleteProduct);

export default router;
