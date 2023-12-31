import type { RequestHandler, Request } from "express";
import createHttpError from "http-errors";
import OrderModel, { type IOrder } from "@/models/order";
import RoomModel from "@/models/room";
import crypto from "crypto";
import "dotenv/config";
import { getTransporter } from "@/controllers/verify";

const {
  MerchantID,
  HASHKEY,
  HASHIV,
  Version,
  NotifyUrl,
  ReturnUrl,
  RedirectUrl,
} = process.env;
const RespondType = "JSON";

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

// 取得對應的 merchantOrderNo 訂單，並返回成功訊息
export const getOrderByMerchantOrderNo: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const result = await OrderModel.findOne({
      merchantOrderNo: req.params.id,
    });
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

export const createOrder: RequestHandler = async (req, res, next) => {
  try {
    const { userId, bookingInfo, guestCount, totalPrice, notes } = req.body;

    const timeStamp = Math.round(new Date().getTime() / 1000);
    const order = {
      userId,
      bookingInfo,
      guestCount,
      totalPrice,
      notes,
      merchantOrderNo: timeStamp,
      timeStamp: timeStamp,
    };

    const result = await OrderModel.create(order);
    const newebpayResponse = await createNewebpayOrder(
      result,
      req.user?.email || ""
    );

    await OrderModel.populate(result, [{ path: "bookingInfo.roomTypeId" }]);

    res.send({
      status: true,
      result,
      newebpayResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const newebpayNotify: RequestHandler = async (req, res, next) => {
  // #swagger.ignore = true
  try {
    const response = req.body;

    // 解密交易內容
    const { Result } = createSesDecrypt(response.TradeInfo);
    // 取得交易內容，並查詢資料庫是否有相符的訂單
    const result = await OrderModel.findOne({
      merchantOrderNo: Result.MerchantOrderNo,
    }).populate("userId");

    if (!result) {
      throw createHttpError(404, "此訂單不存在");
    }
    if (
      !result.userId ||
      typeof result.userId !== "object" ||
      !("email" in result.userId)
    ) {
      throw createHttpError(500, "使用者資訊不存在");
    }
    // 更新訂單狀態
    result.isPay = true;
    result.status = 1;
    await result.save();
    // 更新房型的 bookedDates
    updateRoomBookedDates(result, 1);

    const transporter = await getTransporter();

    await transporter.sendMail({
      from: process.env.EMAILER_USER,
      to: result.userId.email as string,
      subject: "享樂旅館 - 訂房成功",
      html: `<p>恭喜您訂房成功，歡迎您的到來。</p>`,
    });
    return res.end();
  } catch (error) {
    next(error);
  }
};

export const newebpayReturn: RequestHandler = async (req, res, next) => {
  // #swagger.ignore = true
  try {
    const response = req.body;

    // 解密交易內容
    const { Result } = createSesDecrypt(response.TradeInfo);
    // 取得交易內容，並查詢資料庫是否有相符的訂單
    const result = await OrderModel.findOne({
      merchantOrderNo: Result.MerchantOrderNo,
    });
    if (!result) {
      throw createHttpError(404, "此訂單不存在");
    }
    return res.redirect(
      `${RedirectUrl}?MerchantOrderNo=${result.merchantOrderNo}`
    );
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

const createNewebpayOrder = async (order: IOrder, email: string) => {
  const aesEncrypt = createSesEncrypt(order, email);
  const shaEncrypt = createShaEncrypt(aesEncrypt);

  const data = {
    MerchantID: MerchantID,
    RespondType: "JSON",
    TimeStamp: order.timeStamp,
    Version: "2.0",
    MerchantOrderNo: order.merchantOrderNo,
    Amt: order.totalPrice,
    ItemDesc: order.notes,
    Email: email,
    aesEncrypt: aesEncrypt,
    shaEncrypt: shaEncrypt,
  };
  return data;
};

function genDataChain(order: IOrder, email: string) {
  return `MerchantID=${MerchantID}&TimeStamp=${
    order.timeStamp
  }&Version=${Version}&RespondType=${RespondType}&MerchantOrderNo=${
    order.merchantOrderNo
  }&Amt=${order.totalPrice}&NotifyURL=${encodeURIComponent(
    NotifyUrl
  )}&ReturnURL=${encodeURIComponent(ReturnUrl)}&ItemDesc=${encodeURIComponent(
    order.notes
  )}&Email=${encodeURIComponent(email)}`;
}

function createSesEncrypt(TradeInfo: IOrder, email: string) {
  const encrypt = crypto.createCipheriv("aes-256-cbc", HASHKEY, HASHIV);
  const enc = encrypt.update(genDataChain(TradeInfo, email), "utf8", "hex");
  return enc + encrypt.final("hex");
}

function createShaEncrypt(aesEncrypt: string) {
  const sha = crypto.createHash("sha256");
  const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;

  return sha.update(plainText).digest("hex").toUpperCase();
}

function createSesDecrypt(TradeInfo: string) {
  const decrypt = crypto.createDecipheriv("aes256", HASHKEY, HASHIV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(TradeInfo, "hex", "utf8");
  const plainText = text + decrypt.final("utf8");
  const result = plainText.replace(/[\x00-\x20]+/g, "");
  return JSON.parse(result);
}
