import { Router } from "express";
import * as UserController from "@/controllers/user";
import {
  checkRequestBodyValidator,
  isAuth,
  checkAuthorize,
  checkObjectID,
} from "@/middlewares";

const router = Router();

router.post(
  /**
   * #swagger.description  = "注意！！若使用假信箱，將收不到驗證碼，也就無法使用相關服務"
   * #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              name: "Vic",
              email: "vics@example.com",
              password: "Vv123456",
              phone: "0922123456",
              birthday: "1982/2/4 or 1982-2-4",
          }
      }
   * #swagger.responses[200] = {
          description: '註冊成功',
          schema: {
              "status": true,
              "token": "eyJhbGciOiJIUzI....",
              "result": {
                  "_id": "6533f0ef4cdf5b7f762747b0",
                  "name": "Vic",
                  "createdAt": "2023-12-20T15:40:31.526Z",
                  "updatedAt": "2023-12-20T15:40:31.526Z",
              }
          }
      }
   * #swagger.responses[400] = {
          description: '註冊失敗',
          schema: {
              "status": false,
              "message": "此 Email 已註冊",
          }
      }
   */
  "/signup",
  UserController.signup
);

router.post(
  /**
   * #swagger.description  = "登入"
   * #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              email: "vics@example.com",
              password: "Vv123456",
          }
      }
   * #swagger.responses[200] = {
          description: '登入成功',
          schema: {
              "status": true,
              "token": "eyJhbGciOiJIUzI....",
              "result": {
                  "_id": "6533f0ef4cdf5b7f762747b0",
                  "name": "Vic",
                  "email": "vics@example.com",
                  "phone": "0922123456",
                  "birthday": "1982-02-03T16:00:00.000Z",
                  "createdAt": "2023-12-20T15:40:31.526Z",
                  "updatedAt": "2023-12-20T15:40:31.526Z",
              }
          }
      }
   * #swagger.responses[400] = {
          description: '登入失敗',
          schema: {
              "status": false,
              "message": "密碼錯誤",
          }
      }
   * #swagger.responses[400] = {
          schema: {
              "status": false,
              "message": "此使用者不存在",
          }
      }
   */
  "/login",
  UserController.login
);

router.post(
  /**
   * #swagger.description  = "忘記密碼"
   * #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              email: "vics@example.com",
              code: "0Zvjde",
              newPassword: "Dd123456",
          }
      }
   * #swagger.responses[200] = {
          schema: {
              "status": true,
          }
      }
   * #swagger.responses[404] = {
          schema: {
              "status": false,
              "message": "此使用者不存在",
          }
      }
   */
  "/forgot",
  checkRequestBodyValidator,
  UserController.forget
);

router.get(
  /**
   * #swagger.description  = "檢查是否登入"
   * #swagger.responses[200] = {
          description: '登入成功',
          schema: {
              "status": true,
          }
      }
   */
  "/check",
  isAuth,
  UserController.check
);

router.get(
  /**
   * #swagger.description  = "取得使用者資訊"
   * #swagger.responses[200] = {
          schema: {
              "status": true,
              "token": "eyJhbGciOiJI....",
              "result": {
                  "_id": "6533f0ef4cdf5b7f762747b0",
                  "name": "Vic",
                  "email": "vics@example.com",
                  "phone": "0922123456",
                  "birthday": "1982-02-03T16:00:00.000Z",
                  "createdAt": "2023-12-20T15:40:31.526Z",
                  "updatedAt": "2023-12-20T15:40:31.526Z",
              }
          }
      }
   */
  "/",
  isAuth,
  UserController.getInfo
);

router.put(
  /**
   * #swagger.description  = "更新使用者資訊"
   * #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              userId: "6523e9fc3a22dd8d8207ef80",
              name: "Vics",
              phone: "0922123456",
              birthday: "1948/6/5",
              oldPassword: "舊密碼",
              newPassword: "新密碼",
          }
      }
   * #swagger.responses[400] = {
          schema: {
              "status": false,
              "message": "密碼錯誤",
          }
      }
   * #swagger.responses[404] = {
          schema: {
              "status": false,
              "message": "此使用者不存在",
          }
      }
   */
  "/",
  isAuth,
  UserController.updateInfo
);

router.patch(
  "/:id/role",
  isAuth,
  checkAuthorize,
  checkObjectID,
  UserController.updateUserAuthorize
);

export default router;
