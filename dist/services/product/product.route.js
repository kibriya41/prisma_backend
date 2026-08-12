"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_validation_1 = require("./product.validation");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.default)(product_validation_1.productValidation.createProductSchema), product_controller_1.ProductController.createProduct);
router.get("/", product_controller_1.ProductController.getAllProducts);
router.get("/:id", product_controller_1.ProductController.getProductById);
router.patch("/:id", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.default)(product_validation_1.productValidation.updateProductSchema), product_controller_1.ProductController.updateProduct);
router.delete("/:id", (0, auth_1.auth)("ADMIN"), product_controller_1.ProductController.softDeleteProduct);
exports.default = router;
