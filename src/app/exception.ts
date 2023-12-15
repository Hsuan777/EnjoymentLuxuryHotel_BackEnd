import type { ErrorRequestHandler, RequestHandler } from "express";

// 404 Not Found
export const notFound: RequestHandler = (req, res, next) => {
  // new Error 會回傳一個 Error 物件
  // 傳入的參數會是要顯示的錯誤訊息
  // 畫面上會顯示 {message: 'Not Found - /api/xxx', stack: '錯誤訊息'}
  // const error = new Error(`Not Found - ${req.originalUrl}`);
  // res.status(404);
  // next(error);

  // new Error 會回傳 stack, 改用 JSON 格式的錯誤訊息
  res.status(404).send({
    status: false,
    message: "此路徑不存在喔！🤪",
  });
};

// 400 Bad Request
export const badRequest: ErrorRequestHandler = (err, _req, res, next) => {
  // 處理不同的錯誤訊息
  res.status(400).send({
    status: false,
    message:
      process.env.NODE_ENV === "production" ? "請求錯誤喔！😛" : err.stack,
  });
};

// 500 Internal Server Error
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  res.status(500).send({
    status: false,
    message:
      process.env.NODE_ENV === "production" ? "伺服器有問題！😱" : err.stack,
  });
};

export const catchGlobalError = () => {
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
  });
};
