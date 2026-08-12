import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

const createOrder = async (
  userId: string,
  payload: { items: Array<{ productId: string; quantity: number }> }
) => {
  return await prisma.$transaction(async (tx) => {
    let total = 0;
    const orderItemsData = [];

    for (const item of payload.items) {
      const product = await tx.product.findFirst({
        where: { id: item.productId, isDeleted: false },
      });

      if (!product) {
        throw new ApiError(404, `Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for product: ${product.title}`
        );
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      const newStock = product.stock - item.quantity;
      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: newStock,
          status: newStock === 0 ? "OUT_OF_STOCK" : product.status,
        },
      });
    }

    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, title: true, price: true },
            },
          },
        },
      },
    });

    return order;
  });
};

const getAllOrders = async (
  user: { id: string; role: string },
  queryOptions: { status?: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"; page?: number; limit?: number }
) => {
  const page = Number(queryOptions.page) || 1;
  const limit = Number(queryOptions.limit) || 10;
  const skip = (page - 1) * limit;

  const whereConditions: any = { isDeleted: false };

  if (user.role !== "ADMIN") {
    whereConditions.userId = user.id;
  }

  if (queryOptions.status) {
    whereConditions.status = queryOptions.status;
  }

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: {
            product: {
              select: { id: true, title: true, price: true },
            },
          },
        },
      },
    }),
    prisma.order.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: { page, limit, total },
    data,
  };
};

const getOrderById = async (id: string, user: { id: string; role: string }) => {
  const order = await prisma.order.findFirst({
    where: { id, isDeleted: false },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) throw new ApiError(404, "Order not found");

  if (user.role !== "ADMIN" && order.userId !== user.id) {
    throw new ApiError(403, "Forbidden access");
  }

  return order;
};

const updateOrderStatus = async (
  id: string,
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"
) => {
  const order = await prisma.order.findFirst({
    where: { id, isDeleted: false },
  });
  if (!order) throw new ApiError(404, "Order not found");

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: true,
    },
  });

  return updated;
};

const softDeleteOrder = async (id: string, user: { id: string; role: string }) => {
  const order = await getOrderById(id, user);

  const deleted = await prisma.order.update({
    where: { id: order.id },
    data: { isDeleted: true },
  });

  return deleted;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  softDeleteOrder,
};
