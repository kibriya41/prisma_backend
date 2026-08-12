"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
    jwt: {
        access_secret: process.env.JWT_ACCESS_SECRET || "access_secret",
        access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
        refresh_secret: process.env.JWT_REFRESH_SECRET || "refresh_secret",
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    },
};
