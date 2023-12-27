import { Schema, model, type Document } from "mongoose";
import validator from "validator";

export interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  bookingInfo: [
    {
      roomTypeId: Schema.Types.ObjectId;
      quantity: number;
      arrivalDate: Date;
      departureDate: Date;
    }
  ];
  guestCount: number;
  isPay: boolean;
  totalPrice: number;
  status: number;
  notes: string;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId 未填寫"],
    },
    bookingInfo: [
      {
        roomTypeId: {
          type: Schema.Types.ObjectId,
          ref: "Room",
          required: [true, "roomType 未填寫"],
        },
        quantity: {
          type: Number,
          required: [true, "quantity 未填寫"],
        },
        arrivalDate: {
          type: Date,
          required: [true, "startDate 未填寫"],
        },
        departureDate: {
          type: Date,
          required: [true, "endDate 未填寫"],
        },
      },
    ],
    guestCount: {
      type: Number,
      required: [true, "guestCount 未填寫"],
      validate: {
        validator(value: number) {
          return validator.isInt(`${value}`, { min: 1 });
        },
        message: "guestCount 數量不正確",
      },
    },
    isPay: {
      type: Boolean,
      default: false,
    },
    totalPrice: {
      type: Number,
      required: [true, "totalPrice 未填寫"],
    },
    // 1: 已確認，-1: 已取消，0: 待付款
    status: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("order", orderSchema);
