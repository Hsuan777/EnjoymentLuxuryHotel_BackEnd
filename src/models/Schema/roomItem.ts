import { Schema } from "mongoose";

export enum EnumLayoutItem {
  CityView = "市景",
  Bathroom = "獨立衛浴",
  LivingRoom = "客廳",
  StudyRoom = "書房",
  FloorElevator = "樓層電梯",
}

export enum EnumFacilityItem {
  TV = "平面電視",
  Wardrobe = "衣櫃",
  HairDryer = "吹風機",
  Dehumidifier = "除濕機",
  DeskLamp = "檯燈",
  Refrigerator = "冰箱",
  Bathtub = "浴缸",
  Kettle = "熱水壺",
  Desk = "書桌",
  Speaker = "音響",
}

export enum EnumAmenityItem {
  // 衛生紙、吊衣架、拖鞋、浴巾、刮鬍刀、沐浴用品、刷牙用品、清潔用品、罐裝水、梳子
  ToiletPaper = "衛生紙",
  Hanger = "吊衣架",
  Slippers = "拖鞋",
  BathTowel = "浴巾",
  Razor = "刮鬍刀",
  BathSupplies = "沐浴用品",
  Toothbrush = "刷牙用品",
  CleaningSupplies = "清潔用品",
  BottledWater = "罐裝水",
  Comb = "梳子",
}

export interface IItem {
  title: string;
  isProvide: boolean;
}

export interface LayoutItem extends IItem {
  title: EnumLayoutItem;
}

export interface FacilityItem extends IItem {
  title: EnumFacilityItem;
}

export interface AmenityItem extends IItem {
  title: EnumAmenityItem;
}

const layoutItemSchema = new Schema<LayoutItem>(
  {
    title: {
      type: String,
      enum: Object.values(EnumLayoutItem),
      required: [true, "title 未填寫"],
    },
    isProvide: {
      type: Boolean,
      required: [true, "isProvide 未填寫"],
    },
  },
  { _id: false }
);

const facilityInfoSchema = new Schema<FacilityItem>(
  {
    title: {
      type: String,
      enum: Object.values(EnumFacilityItem),
      required: [true, "title 未填寫"],
    },
    isProvide: {
      type: Boolean,
      required: [true, "isProvide 未填寫"],
    },
  },
  { _id: false }
);

const amenityItemSchema = new Schema<AmenityItem>(
  {
    title: {
      type: String,
      enum: Object.values(EnumAmenityItem),
      required: [true, "title 未填寫"],
    },
    isProvide: {
      type: Boolean,
      required: [true, "isProvide 未填寫"],
    },
  },
  { _id: false }
);

export { layoutItemSchema, facilityInfoSchema, amenityItemSchema };
