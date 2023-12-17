import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import swaggerUi from "swagger-ui-express";
// 必須先執行 npm run swagger-autogen
import swaggerDocument from "swagger/swagger_output.json";
const router = Router();

// router.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use(
  "/api-doc",
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    swaggerDocument.host = `${req.headers.host}`;

    if (process.env.NODE_ENV !== "development") {
      swaggerDocument.schemes = ["https"];
    }

    const opts = {
      customSiteTitle: swaggerDocument?.info?.title,
    };

    const requestHandler = swaggerUi.setup(swaggerDocument, opts);

    requestHandler(req, res, next);
  }
);

export default router;
