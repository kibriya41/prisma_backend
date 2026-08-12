import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

const createCategory = async (payload: { name: string; slug?: string }) => {
  const slug =
    payload.slug || payload.name.toLowerCase().replace(/[^a-z0-0]/g, "-");

  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: payload.name }, { slug }] },
  });
  if (existing) throw new ApiError(409, "Category name or slug already exists");

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      slug,
    },
  });

  return category;
};

const getAllCategories = async (options: { page?: number; limit?: number }) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where: { isDeleted: false },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.count({
      where: { isDeleted: false },
    }),
  ]);

  return {
    meta: { page, limit, total },
    data,
  };
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: { id, isDeleted: false },
    include: {
      products: {
        where: { isDeleted: false },
      },
    },
  });
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};

const updateCategory = async (
  id: string,
  payload: { name?: string; slug?: string }
) => {
  await getCategoryById(id);

  const dataToUpdate: { name?: string; slug?: string } = { ...payload };
  if (payload.name && !payload.slug) {
    dataToUpdate.slug = payload.name.toLowerCase().replace(/[^a-z0-0]/g, "-");
  }

  const updated = await prisma.category.update({
    where: { id },
    data: dataToUpdate,
  });

  return updated;
};

const softDeleteCategory = async (id: string) => {
  await getCategoryById(id);

  const deleted = await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });

  return deleted;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  softDeleteCategory,
};
