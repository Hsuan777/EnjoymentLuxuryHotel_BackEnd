import { Router } from "express";
import * as CulinaryController from "@/controllers/culinary";
import { checkObjectID, isAuth, checkAuthorize } from "@/middlewares";

const router = Router();

// 取得所有佳餚
router.get(
  /**
     * #swagger.description  = "取得所有佳餚"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": [
                    { $ref: '#/definitions/CulinaryResponses' },
                ]
            }
        }
     */
  "/",
  CulinaryController.getCulinaryList
);

// 取得單筆佳餚
router.get(
  /**
     * #swagger.description  = "取得單筆佳餚"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/CulinaryResponses' },
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此佳餚不存在",
            }
        }
     */
  "/:id",
  checkObjectID,
  CulinaryController.getCulinaryById
);

// 新增佳餚
router.post(
  /**
     * #swagger.description  = "新增佳餚"
     * #swagger.parameters['newCulinary'] = {
            in: 'body',
            description: '新增佳餚',
            required: true,
            schema: {
                $ref: '#/definitions/CulinaryRequestBody'
            }
        }
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/CulinaryResponses' },
            }
        }
     */
  "/",
  isAuth,
  checkAuthorize,
  CulinaryController.createCulinary
);

// 更新佳餚
router.patch(
  /**
     * #swagger.description  = "更新佳餚"
     * #swagger.parameters['updateCulinary'] = {
            in: 'body',
            description: '更新佳餚',
            required: true,
            schema: {
                $ref: '#/definitions/CulinaryRequestBody'
            }
        }
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/CulinaryResponses' },
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此佳餚不存在",
            }
        }
     */
  "/:id",
  isAuth,
  checkAuthorize,
  checkObjectID,
  CulinaryController.updateCulinaryById
);

// 刪除佳餚
router.delete(
  /**
     * #swagger.description  = "刪除佳餚"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/CulinaryResponses' },
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此佳餚不存在",
            }
        }
     */
  "/:id",
  isAuth,
  checkAuthorize,
  checkObjectID,
  CulinaryController.deleteCulinaryById
);

export default router;
