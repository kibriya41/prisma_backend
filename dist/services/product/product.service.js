"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const createProduct = async (payload) => {
    const category = await prisma_1.default.category.findFirst({
        where: { id: payload.categoryId, isDeleted: false },
    });
    if (!category)
        throw new ApiError_1.default(404, "Category not found");
    const product = await prisma_1.default.product.create({
        data: payload,
        include: {
            category: true,
        },
    });
    return product;
};
const getAllProducts = async (queryOptions) => {
    const page = Number(queryOptions.page) || 1;
    const limit = Number(queryOptions.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = queryOptions.sortBy || "createdAt";
    const sortOrder = queryOptions.sortOrder || "desc";
    const andConditions = [{ isDeleted: false }];
    if (queryOptions.searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: queryOptions.searchTerm, mode: "insensitive" } },
                { description: { contains: queryOptions.searchTerm, mode: "insensitive" } },
            ],
        });
    }
    if (queryOptions.categoryId) {
        andConditions.push({ categoryId: queryOptions.categoryId });
    }
    if (queryOptions.status) {
        andConditions.push({ status: queryOptions.status });
    }
    if (queryOptions.minPrice !== undefined || queryOptions.maxPrice !== undefined) {
        const priceCondition = {};
        if (queryOptions.minPrice !== undefined)
            priceCondition.gte = Number(queryOptions.minPrice);
        if (queryOptions.maxPrice !== undefined)
            priceCondition.lte = Number(queryOptions.maxPrice);
        andConditions.push({ price: priceCondition });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const [data, total] = await Promise.all([
        prisma_1.default.product.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                category: true,
            },
        }),
        prisma_1.default.product.count({
            where: whereConditions,
        }),
    ]);
    return {
        meta: { page, limit, total },
        data,
    };
};
const getProductById = async (id) => {
    const product = await prisma_1.default.product.findFirst({
        where: { id, isDeleted: false },
        include: {
            category: true,
            reviews: {
                where: { isDeleted: false },
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
            },
        },
    });
    if (!product)
        throw new ApiError_1.default(404, "Product not found");
    return product;
};
const updateProduct = async (id, payload) => {
    await getProductById(id);
    if (payload.categoryId) {
        const category = await prisma_1.default.category.findFirst({
            where: { id: payload.categoryId, isDeleted: false },
        });
        if (!category)
            throw new ApiError_1.default(404, "Category not found");
    }
    const updated = await prisma_1.default.product.update({
        where: { id },
        data: payload,
        include: {
            category: true,
        },
    });
    return updated;
};
const softDeleteProduct = async (id) => {
    await getProductById(id);
    const deleted = await prisma_1.default.product.update({
        where: { id },
        data: { isDeleted: true },
    });
    return deleted;
};
exports.ProductService = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    softDeleteProduct,
};
