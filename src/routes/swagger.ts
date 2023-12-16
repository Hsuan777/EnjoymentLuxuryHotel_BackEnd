import { Router } from "express";
import swaggerUi from "swagger-ui-express";
// 必須先執行 npm run swagger-autogen
import swaggerDocument from "swagger/swagger_output.json";
const router = Router();

router.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
