import { Router } from "express";
import authRoutes from "../services/auth/auth.route";
import userRoutes from "../services/user/user.route";
import categoryRoutes from "../services/category/category.route";
import productRoutes from "../services/product/product.route";
import reviewRoutes from "../services/review/review.route";
import orderRoutes from "../services/order/order.route";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRoutes },
  { path: "/categories", route: categoryRoutes },
  { path: "/products", route: productRoutes },
  { path: "/reviews", route: reviewRoutes },
  { path: "/orders", route: orderRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
