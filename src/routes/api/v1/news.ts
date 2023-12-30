import { Router } from "express";
import * as NewsController from "@/controllers/news";
import { checkObjectID, isAuth, checkAuthorize } from "@/middlewares";

const router = Router();

// 取得所有最新消息
router.get(
  /**
     * #swagger.description  = "取得所有最新消息"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": [
                    { $ref: '#/definitions/NewsResponses' },
                ]
            }
        }
     */
  "/",
  NewsController.getNewsList
);

// 取得單筆最新消息
router.get(
  /**
     * #swagger.description  = "取得單筆最新消息"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/NewsResponses' },
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此最新消息不存在",
            }
        }
     */
  "/:id",
  checkObjectID,
  NewsController.getNewsById
);

// 新增一筆最新消息，需驗證身分
router.post(
  /**
     * #swagger.description  = "新增一筆最新消息"
     * #swagger.parameters['new'] = {
            in: 'body',
            required: true,
            type: 'object',
            schema: {
                $ref: '#/definitions/NewsRequestBody'
            }
        }
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/NewsResponses' },
            }
        }
     */
  "/",
  isAuth,
  checkAuthorize,
  NewsController.createOneNews
);

// 更新單筆最新消息，需驗證身分
router.patch(
  /**
     * #swagger.description  = "更新單筆最新消息"
     * #swagger.parameters['new'] = {
            in: 'body',
            required: true,
            type: 'object',
            schema: {
                $ref: '#/definitions/NewsRequestBody'
            }
        }
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/NewsResponses' },
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此最新消息不存在",
            }
        }
     */
  "/:id",
  isAuth,
  checkAuthorize,
  checkObjectID,
  NewsController.updateNewsById
);

// 刪除單筆最新消息，需驗證身分
router.delete(
  /**
     * #swagger.description  = "刪除單筆最新消息"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此最新消息不存在",
            }
        }
     */
  "/:id",
  isAuth,
  checkAuthorize,
  checkObjectID,
  NewsController.deleteNewsById
);

export default router;
