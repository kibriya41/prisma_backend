import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";
import pick from "../../utils/pick";
import { CustomRequest } from "../../middlewares/auth";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user!;
  const result = await OrderService.createOrder(user.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user!;
  const queryOptions = pick(req.query, ["status", "page", "limit"]);
  const result = await OrderService.getAllOrders(user, queryOptions);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Orders retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user!;
  const id = req.params.id as string;
  const result = await OrderService.getOrderById(id, user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await OrderService.updateOrderStatus(id, req.body.status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

const softDeleteOrder = catchAsync(async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user!;
  const id = req.params.id as string;
  const result = await OrderService.softDeleteOrder(id, user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order deleted successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  softDeleteOrder,
};
