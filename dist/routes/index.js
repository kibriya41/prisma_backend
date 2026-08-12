"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../services/auth/auth.route"));
const user_route_1 = __importDefault(require("../services/user/user.route"));
const category_route_1 = __importDefault(require("../services/category/category.route"));
const product_route_1 = __importDefault(require("../services/product/product.route"));
const review_route_1 = __importDefault(require("../services/review/review.route"));
const order_route_1 = __importDefault(require("../services/order/order.route"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: "/auth", route: auth_route_1.default },
    { path: "/users", route: user_route_1.default },
    { path: "/categories", route: category_route_1.default },
    { path: "/products", route: product_route_1.default },
    { path: "/reviews", route: review_route_1.default },
    { path: "/orders", route: order_route_1.default },
];
moduleRoutes.forEach((r) => router.use(r.path, r.route));
exports.default = router;
