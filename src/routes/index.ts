import { Router } from "express";
import healthCheck from "./healthCheck";
import swagger from "./swagger";
import user from "./api/v1/user";

const routers = Router();

routers.use(swagger);
routers.use(healthCheck); // 本身路徑為根目錄 ”/“
routers.use(
  /**
   * #swagger.tags = ["Users - 使用者"]
   */
  "/api/v1/user",
  user
);

export default routers;
