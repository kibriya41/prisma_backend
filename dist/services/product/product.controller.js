"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_service_1 = require("./product.service");
const pick_1 = __importDefault(require("../../utils/pick"));
const createProduct = (0, catchAsync_1.default)(async (req, res) => {
    const result = await product_service_1.ProductService.createProduct(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Product created successfully",
        data: result,
    });
});
const getAllProducts = (0, catchAsync_1.default)(async (req, res) => {
    const queryOptions = (0, pick_1.default)(req.query, [
        "searchTerm",
        "categoryId",
        "status",
        "minPrice",
        "maxPrice",
        "page",
        "limit",
        "sortBy",
        "sortOrder",
    ]);
    const result = await product_service_1.ProductService.getAllProducts(queryOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Products retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getProductById = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await product_service_1.ProductService.getProductById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product retrieved successfully",
        data: result,
    });
});
const updateProduct = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await product_service_1.ProductService.updateProduct(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product updated successfully",
        data: result,
    });
});
const softDeleteProduct = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await product_service_1.ProductService.softDeleteProduct(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product deleted successfully",
        data: result,
    });
});
exports.ProductController = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    softDeleteProduct,
};
