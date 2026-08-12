import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

const createReview = async (
  userId: string,
  payload: { rating: number; comment?: string; productId: string }
) => {
  const product = await prisma.product.findFirst({
    where: { id: payload.productId, isDeleted: false },
  });
  if (!product) throw new ApiError(404, "Product not found");

  const review = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      productId: payload.productId,
      userId,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      product: {
        select: { id: true, title: true },
      },
    },
  });

  return review;
};

const getAllReviews = async (queryOptions: {
  productId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}) => {
  const page = Number(queryOptions.page) || 1;
  const limit = Number(queryOptions.limit) || 10;
  const skip = (page - 1) * limit;

  const whereConditions: any = { isDeleted: false };
  if (queryOptions.productId) whereConditions.productId = queryOptions.productId;
  if (queryOptions.userId) whereConditions.userId = queryOptions.userId;

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        product: {
          select: { id: true, title: true },
        },
      },
    }),
    prisma.review.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: { page, limit, total },
    data,
  };
};

const softDeleteReview = async (
  id: string,
  user: { id: string; role: string }
) => {
  const review = await prisma.review.findFirst({
    where: { id, isDeleted: false },
  });
  if (!review) throw new ApiError(404, "Review not found");

  if (user.role !== "ADMIN" && review.userId !== user.id) {
    throw new ApiError(403, "Forbidden access");
  }

  const deleted = await prisma.review.update({
    where: { id },
    data: { isDeleted: true },
  });

  return deleted;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  softDeleteReview,
};
