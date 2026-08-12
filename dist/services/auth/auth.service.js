"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const jwt_1 = require("../../utils/jwt");
const config_1 = __importDefault(require("../../config"));
const register = async (payload) => {
    const existing = await prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (existing)
        throw new ApiError_1.default(409, "Email already in use");
    const hashed = await bcryptjs_1.default.hash(payload.password, config_1.default.bcrypt_salt_rounds);
    const user = await prisma_1.default.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashed,
        },
    });
    const { password, ...safeUser } = user;
    return safeUser;
};
const login = async (email, password) => {
    const user = await prisma_1.default.user.findFirst({
        where: { email, isDeleted: false },
    });
    if (!user)
        throw new ApiError_1.default(404, "User not found");
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match)
        throw new ApiError_1.default(401, "Invalid credentials");
    const accessToken = (0, jwt_1.generateToken)({ id: user.id, role: user.role }, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    const refreshToken = (0, jwt_1.generateToken)({ id: user.id, role: user.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return { accessToken, refreshToken };
};
exports.AuthService = { register, login };
