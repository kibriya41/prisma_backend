import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import { Prisma } from "@prisma/client";

const createProduct = async (payload: {
  title: string;
  description?: string;
  price: number;
  stock?: number;
  status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  categoryId: string;
}) => {
  const category = await prisma.category.findFirst({
    where: { id: payload.categoryId, isDeleted: false },
  });
  if (!category) throw new ApiError(404, "Category not found");

  const product = await prisma.product.create({
    data: payload,
    include: {
      category: true,
    },
  });

  return product;
};

const getAllProducts = async (queryOptions: {
  searchTerm?: string;
  categoryId?: string;
  status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const page = Number(queryOptions.page) || 1;
  const limit = Number(queryOptions.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = queryOptions.sortBy || "createdAt";
  const sortOrder = queryOptions.sortOrder || "desc";

  const andConditions: Prisma.ProductWhereInput[] = [{ isDeleted: false }];

  if (queryOptions.searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: queryOptions.searchTerm, mode: "insensitive" } },
        { description: { contains: queryOptions.searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (queryOptions.categoryId) {
    andConditions.push({ categoryId: queryOptions.categoryId });
  }

  if (queryOptions.status) {
    andConditions.push({ status: queryOptions.status });
  }

  if (queryOptions.minPrice !== undefined || queryOptions.maxPrice !== undefined) {
    const priceCondition: Prisma.FloatFilter = {};
    if (queryOptions.minPrice !== undefined) priceCondition.gte = Number(queryOptions.minPrice);
    if (queryOptions.maxPrice !== undefined) priceCondition.lte = Number(queryOptions.maxPrice);
    andConditions.push({ price: priceCondition });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: true,
      },
    }),
    prisma.product.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: { page, limit, total },
    data,
  };
};

const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: {
      category: true,
      reviews: {
        where: { isDeleted: false },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

const updateProduct = async (
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    price: number;
    stock: number;
    status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
    categoryId: string;
  }>
) => {
  await getProductById(id);

  if (payload.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: payload.categoryId, isDeleted: false },
    });
    if (!category) throw new ApiError(404, "Category not found");
  }

  const updated = await prisma.product.update({
    where: { id },
    data: payload,
    include: {
      category: true,
    },
  });

  return updated;
};

const softDeleteProduct = async (id: string) => {
  await getProductById(id);

  const deleted = await prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });

  return deleted;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
};
