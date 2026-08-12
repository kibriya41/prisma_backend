import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";
import pick from "../../utils/pick";
import ApiError from "../../utils/ApiError";
import { CustomRequest } from "../../middlewares/auth";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit"]);
  const result = await UserService.getAllUsers(options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const currentUser = (req as CustomRequest).user;
  const id = req.params.id as string;

  if (currentUser?.role !== "ADMIN" && currentUser?.id !== id) {
    throw new ApiError(403, "Forbidden access");
  }

  const result = await UserService.getUserById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const currentUser = (req as CustomRequest).user;
  const id = req.params.id as string;

  if (currentUser?.role !== "ADMIN" && currentUser?.id !== id) {
    throw new ApiError(403, "Forbidden access");
  }

  const result = await UserService.updateUser(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const softDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await UserService.softDeleteUser(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
};
