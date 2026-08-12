import express from "express";
import cors from "cors";
import routes from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.get("/", (_req, res) => {
  res.send({ message: "SCIC/EJP-13 API is running" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(globalErrorHandler);

export default app;