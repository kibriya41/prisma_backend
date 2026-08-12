"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const getAllUsers = async (options) => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        prisma_1.default.user.findMany({
            where: { isDeleted: false },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.default.user.count({
            where: { isDeleted: false },
        }),
    ]);
    return {
        meta: { page, limit, total },
        data,
    };
};
const getUserById = async (id) => {
    const user = await prisma_1.default.user.findFirst({
        where: { id, isDeleted: false },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user)
        throw new ApiError_1.default(404, "User not found");
    return user;
};
const updateUser = async (id, payload) => {
    await getUserById(id);
    const updated = await prisma_1.default.user.update({
        where: { id },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updated;
};
const softDeleteUser = async (id) => {
    await getUserById(id);
    const deleted = await prisma_1.default.user.update({
        where: { id },
        data: { isDeleted: true },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return deleted;
};
exports.UserService = {
    getAllUsers,
    getUserById,
    updateUser,
    softDeleteUser,
};
