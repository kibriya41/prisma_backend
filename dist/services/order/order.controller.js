"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
const pick_1 = __importDefault(require("../../utils/pick"));
const createOrder = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await order_service_1.OrderService.createOrder(user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Order created successfully",
        data: result,
    });
});
const getAllOrders = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const queryOptions = (0, pick_1.default)(req.query, ["status", "page", "limit"]);
    const result = await order_service_1.OrderService.getAllOrders(user, queryOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Orders retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getOrderById = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const id = req.params.id;
    const result = await order_service_1.OrderService.getOrderById(id, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order retrieved successfully",
        data: result,
    });
});
const updateOrderStatus = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await order_service_1.OrderService.updateOrderStatus(id, req.body.status);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order status updated successfully",
        data: result,
    });
});
const softDeleteOrder = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const id = req.params.id;
    const result = await order_service_1.OrderService.softDeleteOrder(id, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order deleted successfully",
        data: result,
    });
});
exports.OrderController = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    softDeleteOrder,
};
