import { Schema, model, type Document } from "mongoose";
import validator from "validator";

export interface INews extends Document {
  title: string;
  description: string;
  image: string;
}

const newsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, "title 未填寫"],
    },
    description: {
      type: String,
      required: [true, "description 未填寫"],
    },
    image: {
      type: String,
      required: [true, "image 未填寫"],
      validate: {
        validator(value: string) {
          return validator.isURL(value, { protocols: ["https"] });
        },
        message: "image 網址協定或附檔名不正確",
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("new", newsSchema);
