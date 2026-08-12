"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_validation_1 = require("./order.validation");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.auth)("USER", "ADMIN"), (0, validateRequest_1.default)(order_validation_1.orderValidation.createOrderSchema), order_controller_1.OrderController.createOrder);
router.get("/", (0, auth_1.auth)("USER", "ADMIN"), order_controller_1.OrderController.getAllOrders);
router.get("/:id", (0, auth_1.auth)("USER", "ADMIN"), order_controller_1.OrderController.getOrderById);
router.patch("/:id", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.default)(order_validation_1.orderValidation.updateOrderStatusSchema), order_controller_1.OrderController.updateOrderStatus);
router.delete("/:id", (0, auth_1.auth)("USER", "ADMIN"), order_controller_1.OrderController.softDeleteOrder);
exports.default = router;
