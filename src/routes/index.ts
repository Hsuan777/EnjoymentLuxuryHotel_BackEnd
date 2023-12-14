import { Router } from "express";
import healthCheck from "./healthCheck";

const routers = Router();

routers.use(healthCheck); // 本身路徑為根目錄 ”/“

export default routers;
