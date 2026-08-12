"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const createCategory = async (payload) => {
    const slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-0]/g, "-");
    const existing = await prisma_1.default.category.findFirst({
        where: { OR: [{ name: payload.name }, { slug }] },
    });
    if (existing)
        throw new ApiError_1.default(409, "Category name or slug already exists");
    const category = await prisma_1.default.category.create({
        data: {
            name: payload.name,
            slug,
        },
    });
    return category;
};
const getAllCategories = async (options) => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        prisma_1.default.category.findMany({
            where: { isDeleted: false },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.default.category.count({
            where: { isDeleted: false },
        }),
    ]);
    return {
        meta: { page, limit, total },
        data,
    };
};
const getCategoryById = async (id) => {
    const category = await prisma_1.default.category.findFirst({
        where: { id, isDeleted: false },
        include: {
            products: {
                where: { isDeleted: false },
            },
        },
    });
    if (!category)
        throw new ApiError_1.default(404, "Category not found");
    return category;
};
const updateCategory = async (id, payload) => {
    await getCategoryById(id);
    const dataToUpdate = { ...payload };
    if (payload.name && !payload.slug) {
        dataToUpdate.slug = payload.name.toLowerCase().replace(/[^a-z0-0]/g, "-");
    }
    const updated = await prisma_1.default.category.update({
        where: { id },
        data: dataToUpdate,
    });
    return updated;
};
const softDeleteCategory = async (id) => {
    await getCategoryById(id);
    const deleted = await prisma_1.default.category.update({
        where: { id },
        data: { isDeleted: true },
    });
    return deleted;
};
exports.CategoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    softDeleteCategory,
};
