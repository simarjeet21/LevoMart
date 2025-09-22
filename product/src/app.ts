import cookieSession from "cookie-session";
import express from "express";
import { currentUser } from "./middlewares/current-user";

import { NotFoundError } from "./utils/errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { productRoutes } from "./routes/indexRoutes";
import { swaggerSpec, swaggerUi } from "./swagger";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);

app.use(productRoutes);
app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.all("/*splat", (req, res, next) => {
  next(new NotFoundError());
});
// app.all("*", (req, res, next) => {
//   next(new NotFoundError());
// });

export { app };
