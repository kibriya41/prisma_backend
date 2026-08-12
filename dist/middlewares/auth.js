"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const jwt_1 = require("../utils/jwt");
const config_1 = __importDefault(require("../config"));
const auth = (...roles) => (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError_1.default(401, "No token provided");
        }
        const token = authHeader.split(" ")[1];
        if (!token)
            throw new ApiError_1.default(401, "No token provided");
        const decoded = (0, jwt_1.verifyToken)(token, config_1.default.jwt.access_secret);
        if (roles.length && !roles.includes(decoded.role)) {
            throw new ApiError_1.default(403, "Forbidden access");
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.auth = auth;
