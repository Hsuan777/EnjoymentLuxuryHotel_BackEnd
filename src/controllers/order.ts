import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import OrderModel, { type IOrder } from "@/models/order";
import RoomModel from "@/models/room";

export const getOrderList: RequestHandler = async (_req, res, next) => {
  try {
    const result = await OrderModel.find({ status: { $ne: -1 } }).populate({
      path: "bookingInfo.roomTypeId",
    });

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrderList: RequestHandler = async (req, res, next) => {
  try {
    const result = await OrderModel.find({
      userId: req.user?._id,
      status: { $ne: -1 },
    }).populate({
      path: "bookingInfo.roomTypeId",
    });

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById: RequestHandler = async (req, res, next) => {
  try {
    const result = await OrderModel.findById(req.params.id).populate(
      "bookingInfo.roomTypeId"
    );
    if (!result) {
      throw createHttpError(404, "此訂單不存在");
    }
    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder: RequestHandler = async (req, res, next) => {
  try {
    const { userId, bookingInfo, guestCount, totalPrice, notes } = req.body;

    const order = new OrderModel({
      userId,
      bookingInfo,
      guestCount,
      totalPrice,
      notes,
    });

    const result = await order.save();

    await OrderModel.populate(result, [{ path: "bookingInfo.roomTypeId" }]);

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderById: RequestHandler = async (req, res, next) => {
  try {
    const { bookingInfo, guestCount, totalPrice, notes, status, isPay } =
      req.body;

    const result = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { bookingInfo, guestCount, totalPrice, notes, status, isPay },
      { new: true, runValidators: true }
    ).populate("bookingInfo.roomTypeId");

    if (!result) {
      throw createHttpError(404, "此訂單不存在");
    }

    // 如果 status 為 1 表示訂單已確認，則更新房型的 bookedDates
    if (status === 1 && isPay) {
      updateRoomBookedDates(result, 1);
    }

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrderById: RequestHandler = async (req, res, next) => {
  try {
    const result = await OrderModel.findById(req.params.id);
    if (result?.isPay) {
      throw createHttpError(400, "此訂單已結帳，請更新狀態後再操作");
    }
    const updateResult = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status: -1 },
      { new: true, runValidators: true }
    );

    if (!updateResult) {
      throw createHttpError(404, "此訂單不存在");
    }

    if (updateResult.status === -1) {
      updateRoomBookedDates(updateResult, -1);
    }

    res.send({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

const updateRoomBookedDates = async (order: IOrder, status: number) => {
  const { bookingInfo } = order;
  bookingInfo.forEach(async (item) => {
    const { arrivalDate, departureDate, quantity } = item;
    const room = await RoomModel.findOne(item.roomTypeId);
    if (!room) {
      throw createHttpError(404, "此房型不存在");
    }
    // 對於該範圍內的每一天
    for (
      let date = new Date(arrivalDate.setHours(0, 0, 0, 0));
      date < new Date(departureDate.setHours(0, 0, 0, 0));
      date.setDate(date.getDate() + 1)
    ) {
      // 找到 dailyAvailability 陣列中對應的物件
      let availability = room.dailyAvailability.find(
        (daily) =>
          daily.date.getFullYear() === date.getFullYear() &&
          daily.date.getMonth() === date.getMonth() &&
          daily.date.getDate() === date.getDate() &&
          daily.orderId.toString() === order._id.toString()
      );
      // 如果不存在，則創建新的物件
      if (!availability && status === 1) {
        room.dailyAvailability.push({
          date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          orderId: order._id,
          bookedQuantity: quantity,
        });
      } else if (availability && status === 1) {
        availability.bookedQuantity = quantity;
        availability.orderId = order._id;
      } else if (availability && status === -1) {
        // 移除相關訂單 Id 的物件
        room.dailyAvailability.forEach((daily, index) => {
          if (daily.orderId.toString() === order._id.toString()) {
            room.dailyAvailability.splice(index, 1);
          }
        });
      }
    }

    // 將更新後的 dailyAvailability 陣列保存回資料庫
    room.save();
  });
};
