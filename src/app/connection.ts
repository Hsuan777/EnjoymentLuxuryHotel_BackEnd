import mongoose from "mongoose";

const { DATABASE, DATABASE_PASSWORD } = process.env;

// 允許查詢未在 schema 中定義的欄位。
mongoose.set("strictQuery", false);

// connect 參數 uri 為 string，但 DATABASE_PASSWORD 為 string | undefined，所以會出錯。
mongoose
  .connect((DATABASE || "").replace("<password>", `${DATABASE_PASSWORD}`))
  .then(() => {
    console.log("[ mongodb 連線成功 ]");
  })
  .catch((error) => {
    console.log("[ mongodb 連線錯誤 ]", error.message);
  });
