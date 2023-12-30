import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import OrderModel from "@/models/order";
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

    // 如果 status 為 1 以及 isPay 為 true，表示訂單已確認，則更新房型的 bookedDates
    if (status === 1 && isPay) {
      const { bookingInfo } = result;
      for (const item of bookingInfo) {
        const { roomTypeId, arrivalDate, departureDate, quantity } = item;

        const room = await RoomModel.findById(roomTypeId);
        if (!room) {
          throw createHttpError(404, "此房型不存在");
        }

        const bookedDates = room.bookedDates;

        const dateList = getDatesBetween(arrivalDate, departureDate);

        for (const date of dateList) {
          const index = bookedDates.findIndex(
            (item) => item.bookedDate.toISOString() === date.toISOString()
          );

          if (index === -1) {
            bookedDates.push({
              bookedDate: date,
              bookedQuantity: quantity,
              orderId: result._id,
              userId: result.userId,
            });
          }
        }
        await RoomModel.findByIdAndUpdate(
          roomTypeId,
          { bookedDates },
          { new: true }
        );
      }
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
    const result = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status: -1 },
      { new: true, runValidators: true }
    );

    if (!result) {
      throw createHttpError(404, "此訂單不存在");
    }

    res.send({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

function getDatesBetween(arrivalDate: Date, departureDate: Date) {
  const dateList = [];
  const currentDate = new Date(arrivalDate);
  while (currentDate < new Date(departureDate)) {
    dateList.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateList;
}
