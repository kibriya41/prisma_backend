import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import { generateToken } from "../../utils/jwt";
import config from "../../config";

const register = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existing) throw new ApiError(409, "Email already in use");

  const hashed = await bcrypt.hash(
    payload.password,
    config.bcrypt_salt_rounds
  );

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashed,
    },
  });

  const { password, ...safeUser } = user;
  return safeUser;
};

const login = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: { email, isDeleted: false },
  });
  if (!user) throw new ApiError(404, "User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError(401, "Invalid credentials");

  const accessToken = generateToken(
    { id: user.id, role: user.role },
    config.jwt.access_secret,
    config.jwt.access_expires_in
  );

  const refreshToken = generateToken(
    { id: user.id, role: user.role },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in
  );

  return { accessToken, refreshToken };
};

export const AuthService = { register, login };
