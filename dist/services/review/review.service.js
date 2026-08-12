"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const createReview = async (userId, payload) => {
    const product = await prisma_1.default.product.findFirst({
        where: { id: payload.productId, isDeleted: false },
    });
    if (!product)
        throw new ApiError_1.default(404, "Product not found");
    const review = await prisma_1.default.review.create({
        data: {
            rating: payload.rating,
            comment: payload.comment,
            productId: payload.productId,
            userId,
        },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
            product: {
                select: { id: true, title: true },
            },
        },
    });
    return review;
};
const getAllReviews = async (queryOptions) => {
    const page = Number(queryOptions.page) || 1;
    const limit = Number(queryOptions.limit) || 10;
    const skip = (page - 1) * limit;
    const whereConditions = { isDeleted: false };
    if (queryOptions.productId)
        whereConditions.productId = queryOptions.productId;
    if (queryOptions.userId)
        whereConditions.userId = queryOptions.userId;
    const [data, total] = await Promise.all([
        prisma_1.default.review.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                product: {
                    select: { id: true, title: true },
                },
            },
        }),
        prisma_1.default.review.count({
            where: whereConditions,
        }),
    ]);
    return {
        meta: { page, limit, total },
        data,
    };
};
const softDeleteReview = async (id, user) => {
    const review = await prisma_1.default.review.findFirst({
        where: { id, isDeleted: false },
    });
    if (!review)
        throw new ApiError_1.default(404, "Review not found");
    if (user.role !== "ADMIN" && review.userId !== user.id) {
        throw new ApiError_1.default(403, "Forbidden access");
    }
    const deleted = await prisma_1.default.review.update({
        where: { id },
        data: { isDeleted: true },
    });
    return deleted;
};
exports.ReviewService = {
    createReview,
    getAllReviews,
    softDeleteReview,
};
