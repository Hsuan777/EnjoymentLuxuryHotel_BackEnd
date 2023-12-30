import { Schema, model, type Document } from "mongoose";
import validator from "validator";

// 繼承至 Document，並定義 IUser 介面，使用 Mongoose 方法時，會有型別提示
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: Date;
  verificationToken: string;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "名稱未填寫"],
      validate: {
        validator: (name: string) => {
          return validator.isLength(name, { min: 2 });
        },
        message: "至少 2 個字",
      },
    },
    email: {
      type: String,
      required: [true, "Email 未填寫"],
      validate: {
        validator(value: string) {
          return validator.isEmail(value);
        },
        message: "Email 格式不正確",
      },
    },
    password: {
      type: String,
      required: [true, "password 未填寫"],
      select: false,
    },
    phone: {
      type: String,
      required: [true, "phone 未填寫"],
      validate: {
        validator: (phone: string) => {
          return validator.isMobilePhone(phone, "zh-TW");
        },
        message: "手機格式不正確",
      },
    },
    birthday: {
      type: Date,
      required: [true, "birthday 未填寫"],
      validate: {
        validator: (birthday: Date) => {
          return validator.isDate(birthday.toISOString().split("T")[0]);
        },
        message: "日期格式不正確",
      },
    },
    // 驗證碼，用來驗證信箱或是重設密碼
    verificationToken: { type: String, default: "", select: false },
    isAdmin: { type: Boolean, default: false, select: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("user", userSchema);
