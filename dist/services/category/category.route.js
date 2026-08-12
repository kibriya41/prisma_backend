"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_validation_1 = require("./category.validation");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.default)(category_validation_1.categoryValidation.createCategorySchema), category_controller_1.CategoryController.createCategory);
router.get("/", category_controller_1.CategoryController.getAllCategories);
router.get("/:id", category_controller_1.CategoryController.getCategoryById);
router.patch("/:id", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.default)(category_validation_1.categoryValidation.updateCategorySchema), category_controller_1.CategoryController.updateCategory);
router.delete("/:id", (0, auth_1.auth)("ADMIN"), category_controller_1.CategoryController.softDeleteCategory);
exports.default = router;
