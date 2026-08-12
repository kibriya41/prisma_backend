import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";
import pick from "../../utils/pick";
import { CustomRequest } from "../../middlewares/auth";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user!;
  const result = await ReviewService.createReview(user.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const queryOptions = pick(req.query, ["productId", "userId", "page", "limit"]);
  const result = await ReviewService.getAllReviews(queryOptions);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const softDeleteReview = catchAsync(async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user!;
  const id = req.params.id as string;
  const result = await ReviewService.softDeleteReview(id, user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  softDeleteReview,
};
