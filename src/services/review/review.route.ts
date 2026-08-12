import { Router } from "express";
import { ReviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { reviewValidation } from "./review.validation";

const router = Router();

router.post(
  "/",
  auth("USER", "ADMIN"),
  validateRequest(reviewValidation.createReviewSchema),
  ReviewController.createReview
);

router.get("/", ReviewController.getAllReviews);

router.delete("/:id", auth("USER", "ADMIN"), ReviewController.softDeleteReview);

export default router;
