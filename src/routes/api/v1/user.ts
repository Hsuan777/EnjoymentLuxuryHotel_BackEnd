import { Router } from "express";
import * as UserController from "@/controllers/user";

const router = Router();

router.post(
  /**
   * #swagger.description  = "註冊"
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
                  "name": "Lori Murphy",
                  "email": "timmothy.ramos@example.com",
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
export default router;
