import { Router } from "express";
import * as RoomController from "@/controllers/room";
import { checkObjectID, isAuth } from "@/middlewares";

const router = Router();

// 取得所有房型
router.get(
  /**
     * #swagger.description  = "取得所有房型"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": [
                    { $ref: '#/definitions/RoomResponses' },
                ]
            }
        }
     */
  "/",
  RoomController.getRoomList
);

// 取得單筆房型
router.get(
  /**
     * #swagger.description  = "取得單筆房型"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/RoomResponses' },
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此房型不存在",
            }
        }
     */
  "/:id",
  checkObjectID,
  RoomController.getRoomById
);

// 新增一筆房型，需驗證身分
router.post(
  /**
     * #swagger.description  = "新增一筆房型"
     * #swagger.parameters['room'] = {
            in: 'body',
            required: true,
            type: 'object',
            schema: {
                $ref: '#/definitions/RoomRequestBody'
            }
        }
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/RoomResponses' },
            }
        }
     */
  "/",
  isAuth,
  RoomController.createOneRoom
);

// 修改一筆房型，需驗證身分
router.patch(
  /**
     * #swagger.description  = "修改一筆房型"
     * #swagger.parameters['room'] = {
            in: 'body',
            required: true,
            type: 'object',
            schema: {
                $ref: '#/definitions/RoomRequestBody'
            }
        }
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/RoomResponses' },
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此房型不存在",
            }
        }
     */
  "/:id",
  isAuth,
  checkObjectID,
  RoomController.updateRoomById
);

// 刪除一筆房型，需驗證身分
router.delete(
  /**
     * #swagger.description  = "刪除一筆房型"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": { $ref: '#/definitions/RoomResponses' },
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此房型不存在",
            }
        }
     */
  "/:id",
  isAuth,
  checkObjectID,
  RoomController.deleteRoomById
);

export default router;
