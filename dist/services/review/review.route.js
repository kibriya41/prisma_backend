"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_validation_1 = require("./review.validation");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.auth)("USER", "ADMIN"), (0, validateRequest_1.default)(review_validation_1.reviewValidation.createReviewSchema), review_controller_1.ReviewController.createReview);
router.get("/", review_controller_1.ReviewController.getAllReviews);
router.delete("/:id", (0, auth_1.auth)("USER", "ADMIN"), review_controller_1.ReviewController.softDeleteReview);
exports.default = router;
