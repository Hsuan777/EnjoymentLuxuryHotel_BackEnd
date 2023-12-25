import express, { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  // #swagger.ignore = true
  const healthCheck = {
    status: true,
    message: "OK, Express + TypeScript Server",
    uptime: process.uptime(),
    timestamp: Date.now(),
    host: req.headers.host,
  };
  res.send(healthCheck);
});

router.use("/favicon.ico", express.static("public/favicon.ico"));

export default router;
