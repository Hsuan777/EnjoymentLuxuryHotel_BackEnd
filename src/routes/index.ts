import { Router } from "express";
import healthCheck from "./healthCheck";
import swagger from "./swagger";

const routers = Router();

routers.use(swagger);
routers.use(healthCheck); // 本身路徑為根目錄 ”/“

export default routers;
