"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const createOrder = async (userId, payload) => {
    return await prisma_1.default.$transaction(async (tx) => {
        let total = 0;
        const orderItemsData = [];
        for (const item of payload.items) {
            const product = await tx.product.findFirst({
                where: { id: item.productId, isDeleted: false },
            });
            if (!product) {
                throw new ApiError_1.default(404, `Product not found: ${item.productId}`);
            }
            if (product.stock < item.quantity) {
                throw new ApiError_1.default(400, `Insufficient stock for product: ${product.title}`);
            }
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            });
            const newStock = product.stock - item.quantity;
            await tx.product.update({
                where: { id: product.id },
                data: {
                    stock: newStock,
                    status: newStock === 0 ? "OUT_OF_STOCK" : product.status,
                },
            });
        }
        const order = await tx.order.create({
            data: {
                userId,
                total,
                status: "PENDING",
                items: {
                    create: orderItemsData,
                },
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, title: true, price: true },
                        },
                    },
                },
            },
        });
        return order;
    });
};
const getAllOrders = async (user, queryOptions) => {
    const page = Number(queryOptions.page) || 1;
    const limit = Number(queryOptions.limit) || 10;
    const skip = (page - 1) * limit;
    const whereConditions = { isDeleted: false };
    if (user.role !== "ADMIN") {
        whereConditions.userId = user.id;
    }
    if (queryOptions.status) {
        whereConditions.status = queryOptions.status;
    }
    const [data, total] = await Promise.all([
        prisma_1.default.order.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                items: {
                    include: {
                        product: {
                            select: { id: true, title: true, price: true },
                        },
                    },
                },
            },
        }),
        prisma_1.default.order.count({
            where: whereConditions,
        }),
    ]);
    return {
        meta: { page, limit, total },
        data,
    };
};
const getOrderById = async (id, user) => {
    const order = await prisma_1.default.order.findFirst({
        where: { id, isDeleted: false },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
    if (!order)
        throw new ApiError_1.default(404, "Order not found");
    if (user.role !== "ADMIN" && order.userId !== user.id) {
        throw new ApiError_1.default(403, "Forbidden access");
    }
    return order;
};
const updateOrderStatus = async (id, status) => {
    const order = await prisma_1.default.order.findFirst({
        where: { id, isDeleted: false },
    });
    if (!order)
        throw new ApiError_1.default(404, "Order not found");
    const updated = await prisma_1.default.order.update({
        where: { id },
        data: { status },
        include: {
            items: true,
        },
    });
    return updated;
};
const softDeleteOrder = async (id, user) => {
    const order = await getOrderById(id, user);
    const deleted = await prisma_1.default.order.update({
        where: { id: order.id },
        data: { isDeleted: true },
    });
    return deleted;
};
exports.OrderService = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    softDeleteOrder,
};
