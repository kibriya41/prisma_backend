"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const pick_1 = __importDefault(require("../../utils/pick"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const options = (0, pick_1.default)(req.query, ["page", "limit"]);
    const result = await user_service_1.UserService.getAllUsers(options);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getUserById = (0, catchAsync_1.default)(async (req, res) => {
    const currentUser = req.user;
    const id = req.params.id;
    if (currentUser?.role !== "ADMIN" && currentUser?.id !== id) {
        throw new ApiError_1.default(403, "Forbidden access");
    }
    const result = await user_service_1.UserService.getUserById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
});
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const currentUser = req.user;
    const id = req.params.id;
    if (currentUser?.role !== "ADMIN" && currentUser?.id !== id) {
        throw new ApiError_1.default(403, "Forbidden access");
    }
    const result = await user_service_1.UserService.updateUser(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});
const softDeleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_1.UserService.softDeleteUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});
exports.UserController = {
    getAllUsers,
    getUserById,
    updateUser,
    softDeleteUser,
};
