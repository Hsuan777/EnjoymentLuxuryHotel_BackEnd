import { Router } from "express";
import healthCheck from "./healthCheck";
import swagger from "./swagger";
import user from "./api/v1/user";
import verify from "./api/v1/verify";
import news from "./api/v1/news";
import room from "./api/v1/room";

const routes = Router();

routes.use(swagger);
routes.use(healthCheck); // 本身路徑為根目錄 ”/“
routes.use(
  /**
   * #swagger.tags = ["Users - 使用者"]
   */
  "/api/v1/user",
  user
);

routes.use(
  /**
   * #swagger.tags = ["Verify - 驗證"]
   */
  "/api/v1/verify",
  verify
);

routes.use(
  /**
   * #swagger.tags = ["News - 最新消息"]
   */
  "/api/v1/news",
  news
);

routes.use(
  /**
   * #swagger.tags = ["Room - 房型"]
   */
  "/api/v1/room",
  room
);

export default routes;
