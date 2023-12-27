import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import OrderModel from "@/models/order";

export const getOrderList: RequestHandler = async (_req, res, next) => {
  try {
    const result = await OrderModel.find()
      .populate({ path: "userId" })
      .populate({ path: "bookingInfo.roomTypeId" });

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
    // TODO: { userId: req.params.id }
    const result = await OrderModel.findById(req.params.id)
      .populate("userId")
      .populate("bookingInfo.roomTypeId");
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

    await OrderModel.populate(result, [
      { path: "userId" },
      { path: "booking.roomTypeId" },
    ]);

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
    const { bookingInfo, guestCount, totalPrice, notes, status } = req.body;

    const result = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { bookingInfo, guestCount, totalPrice, notes, status },
      { new: true, runValidators: true }
    )
      .populate("userId")
      .populate("bookingInfo.roomTypeId");

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

export const deleteOrderById: RequestHandler = async (req, res, next) => {
  try {
    const result = await OrderModel.findByIdAndUpdate(
      {
        _id: req.params.orderId,
        userId: req.user?._id,
      },
      { status: -1 },
      { new: true, runValidators: true }
    )
      .populate("userId")
      .populate("bookingInfo.roomTypeId");

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
