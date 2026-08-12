"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.auth)("ADMIN"), user_controller_1.UserController.getAllUsers);
router.get("/:id", (0, auth_1.auth)("ADMIN", "USER"), user_controller_1.UserController.getUserById);
router.patch("/:id", (0, auth_1.auth)("ADMIN", "USER"), (0, validateRequest_1.default)(user_validation_1.userValidation.updateUserSchema), user_controller_1.UserController.updateUser);
router.delete("/:id", (0, auth_1.auth)("ADMIN"), user_controller_1.UserController.softDeleteUser);
exports.default = router;
