"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const review_service_1 = require("./review.service");
const pick_1 = __importDefault(require("../../utils/pick"));
const createReview = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await review_service_1.ReviewService.createReview(user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Review created successfully",
        data: result,
    });
});
const getAllReviews = (0, catchAsync_1.default)(async (req, res) => {
    const queryOptions = (0, pick_1.default)(req.query, ["productId", "userId", "page", "limit"]);
    const result = await review_service_1.ReviewService.getAllReviews(queryOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Reviews retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const softDeleteReview = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const id = req.params.id;
    const result = await review_service_1.ReviewService.softDeleteReview(id, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review deleted successfully",
        data: result,
    });
});
exports.ReviewController = {
    createReview,
    getAllReviews,
    softDeleteReview,
};
