import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config"; // 引入 dotenv 並執行 config()
// import dotenv from "dotenv/config"; // dotenv 原來的寫法
import "./connection"; // 資料庫連線
// import Routes from '@/routes'; // 引入所有路由
// import * as Exception from '@/app/exception'; // 引入自定義的例外處理

// dotenv.config(); dotenv 原來的寫法

// TS 會自動推斷型別 app: Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(process.env.PORT, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.PORT}`
  );
});
