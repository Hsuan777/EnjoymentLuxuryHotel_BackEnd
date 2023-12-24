import { Schema } from "mongoose";

// 列舉房間床型
enum BedType {
  Single = "單人床",
  Double = "雙人床",
  Queen = "大雙人床",
  King = "加大雙人床",
}

export interface IBedInfo {
  type: string;
  quantity: number;
}

const bedSchema = new Schema<IBedInfo>(
  {
    type: {
      type: String,
      required: [true, "床型未填寫"],
      enum: Object.values(BedType),
    },
    quantity: {
      type: Number,
      required: [true, "床型數量未填寫"],
    },
  },
  {
    _id: false,
  }
);

export default bedSchema;
