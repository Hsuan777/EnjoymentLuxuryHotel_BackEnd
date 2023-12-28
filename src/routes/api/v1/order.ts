import { Router } from "express";
import * as OrderController from "@/controllers/order";
import { checkObjectID, isAuth } from "@/middlewares";

const router = Router();

// 取得所有訂單
router.get(
  /**
     * #swagger.description  = "取得所有訂單"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": [
                    { $ref: '#/definitions/OrderResponses' },
                ]
            }
        }
     */
  "/",
  isAuth,
  OrderController.getOrderList
);

// 取得單筆訂單
router.get(
  /**
     * #swagger.description  = "取得單筆訂單"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/OrderResponses' },
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此訂單不存在",
            }
        }
     */
  "/:id",
  isAuth,
  checkObjectID,
  OrderController.getOrderById
);

// 新增一筆訂單
router.post(
  /**
     * #swagger.description  = "新增一筆訂單"
     * #swagger.parameters['new'] = {
            in: 'body',
            required: true,
            type: 'object',
            schema: {
                $ref: '#/definitions/OrderRequestBody'
            }
        }
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/OrderResponses' },
            }
        }
     */
  "/",
  isAuth,
  OrderController.createOrder
);

// 更新一筆訂單
router.patch(
  /**
     * #swagger.description  = "更新一筆訂單"
     * #swagger.parameters['update'] = {
            in: 'body',
            required: true,
            type: 'object',
            schema: {
                $ref: '#/definitions/OrderRequestBody'
            }
        }
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/OrderResponses' },
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此訂單不存在",
            }
        }
     */
  "/:id",
  isAuth,
  checkObjectID,
  OrderController.updateOrderById
);

// 取消一筆訂單
router.delete(
  /**
     * #swagger.description  = "取消一筆訂單"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此訂單不存在",
            }
        }
     */
  "/:id",
  isAuth,
  checkObjectID,
  OrderController.deleteOrderById
);

export default router;
