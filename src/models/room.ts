import { Schema, model, type Document } from "mongoose";
import validator from "validator";
import {
  layoutItemSchema,
  facilityInfoSchema,
  amenityItemSchema,
  LayoutItem,
  FacilityItem,
  AmenityItem,
} from "./Schema/roomItem";
import bedSchema, { IBedInfo } from "./Schema/roomBedInfo";

export interface IRoom extends Document {
  name: string;
  description: string;
  imageUrl: string; // 封面圖片
  imageUrlList: string[]; // 圖片列表
  areaInfo: string; // 房間面積
  bedInfo: IBedInfo; // 床型
  maxPeople: number;
  minPeople: number;
  price: number;
  status: number; // 可使用：1，已刪除：-1，用於該房型是否可用等狀態
  layoutInfo: LayoutItem[]; // 房間格局
  facilityInfo: FacilityItem[]; // 房內設備
  amenityInfo: AmenityItem[]; // 備品提供
  dailyAvailability: [
    {
      date: Date;
      orderId: Schema.Types.ObjectId;
      bookedQuantity: number;
    }
  ];
  availableQuantity: number; // 可用數量
}

const roomSchema = new Schema<IRoom>(
  {
    name: {
      type: String,
      required: [true, "name 未填寫"],
    },
    description: {
      type: String,
      required: [true, "description 未填寫"],
    },
    imageUrl: {
      type: String,
      required: [true, "imageUrl 未填寫"],
      validate: {
        validator(value: string) {
          return validator.isURL(value, { protocols: ["https"] });
        },
        message: "imageUrl 網址協定或附檔名不正確",
      },
    },
    imageUrlList: [
      {
        type: String,
        trim: true,
        validate: {
          validator(value: string) {
            return validator.isURL(value, { protocols: ["https"] });
          },
          message: "imageUrlList 格式不正確",
        },
      },
    ],
    areaInfo: {
      type: String,
      required: [true, "areaInfo 未填寫"],
    },
    bedInfo: {
      type: bedSchema,
      required: [true, "bedInfo 未填寫"],
    },
    maxPeople: {
      type: Number,
      required: [true, "maxPeople 未填寫"],
    },
    minPeople: {
      type: Number,
      required: [true, "minPeople 未填寫"],
    },
    price: {
      type: Number,
      required: [true, "price 未填寫"],
    },
    status: {
      type: Number,
      default: 1,
    },
    layoutInfo: {
      type: [layoutItemSchema],
      required: [true, "layoutInfo 未填寫"],
    },
    facilityInfo: {
      type: [facilityInfoSchema],
      required: [true, "facilityInfo 未填寫"],
    },
    amenityInfo: {
      type: [amenityItemSchema],
      required: [true, "amenityInfo 未填寫"],
    },
    dailyAvailability: [
      {
        date: Date,
        orderId: {
          type: Schema.Types.ObjectId,
          ref: "order",
        },
        bookedQuantity: Number,
      },
    ],
    availableQuantity: {
      type: Number,
      required: [true, "availableQuantity 未填寫"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("room", roomSchema);
