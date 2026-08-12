import { Router } from "express";
import { OrderController } from "./order.controller";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { orderValidation } from "./order.validation";

const router = Router();

router.post(
  "/",
  auth("USER", "ADMIN"),
  validateRequest(orderValidation.createOrderSchema),
  OrderController.createOrder
);

router.get("/", auth("USER", "ADMIN"), OrderController.getAllOrders);

router.get("/:id", auth("USER", "ADMIN"), OrderController.getOrderById);

router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(orderValidation.updateOrderStatusSchema),
  OrderController.updateOrderStatus
);

router.delete("/:id", auth("USER", "ADMIN"), OrderController.softDeleteOrder);

export default router;
