import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

const getAllUsers = async (options: { page?: number; limit?: number }) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.user.findMany({
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
    prisma.user.count({
      where: { isDeleted: false },
    }),
  ]);

  return {
    meta: { page, limit, total },
    data,
  };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
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
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const updateUser = async (
  id: string,
  payload: { name?: string; role?: "ADMIN" | "USER" }
) => {
  await getUserById(id);

  const updated = await prisma.user.update({
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

const softDeleteUser = async (id: string) => {
  await getUserById(id);

  const deleted = await prisma.user.update({
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

export const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
};
