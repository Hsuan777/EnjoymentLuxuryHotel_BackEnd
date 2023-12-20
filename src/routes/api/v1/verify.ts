import { Router } from "express";
import * as VerifyController from "@/controllers/verify";
import { checkRequestBodyValidator, isAuth } from "@/middlewares";

const router = Router();

router.post(
  /**
     * #swagger.description  = "驗證信箱是否註冊過"
     * #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                email: "youremail@example.com",
            }
        }
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": {
                    "isEmailExists": true
                }
            }
        }
     * #swagger.responses[400] = {
            schema: {
                "status": false,
                "message": "Email 格式不正確",
            }
        }
     */
  "/email",
  VerifyController.checkEmailExists
);

router.post(
  /**
     * #swagger.description  = "產生信箱驗證碼"
     * #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                email: "youremail@example.com",
            }
        }
     * #swagger.responses[200] = {
            schema: {
                "status": true,
            }
        }
     * #swagger.responses[400] = {
            schema: {
                "status": false,
                "message": "Email 格式不正確",
            }
        }
     */
  "/generateEmailCode",
  checkRequestBodyValidator,
  VerifyController.sendVerificationCode
);

router.post(
  /**
     * #swagger.description  = "驗證信箱驗證碼"
     * #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                verificationCode: ""
            }
        }
      * #swagger.responses[200] = {
              schema: {
                  "status": true,
              }
          }
      * #swagger.responses[400] = {
              schema: {
                  "status": false,
                  "message": "驗證碼不正確",
              }
          }
      */
  "/verifyEmailCode",
  isAuth,
  VerifyController.verifyCode
);

export default router;
