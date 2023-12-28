import swaggerAutogen from "swagger-autogen";

const outputFile = `./swagger_output.json`;
const endpointsFiles = ["src/routes/index.ts"];
const doc = {
  info: {
    title: "Vic 享樂旅館 API 文件",
    description:
      "注意事項：登入成功後請點「Authorize」輸入 Token。\n\nξ( ✿＞◡❛)▄︻▇▇〓▄︻┻┳═一 \n\nヽ( ° ▽°)ノヽ( ° ▽°)ノヽ( ° ▽°)ノ",
  },
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      in: "header",
      name: "authorization",
      description: "請加上 API Token",
    },
  },
  definitions: {
    User: {
      name: "Vic",
      avatar: "https://fakeimg.pl/350x200/?text=öㅅö.jpg",
    },
    NewsResponses: {
      id: "6587a5bf67e2dc1d3249b558",
      title: "Vic 享樂旅館開幕囉",
      description: "Vic 享樂旅館開幕囉",
      image: "https://fakeimg.pl/350x200/?text=享樂旅館開幕囉.jpg",
      createdAt: "2021-07-14T09:21:43.000Z",
      updatedAt: "2021-07-14T09:21:43.000Z",
    },
    NewsRequestBody: {
      title: "Vic 享樂旅館開幕囉",
      description: "Vic 享樂旅館開幕囉",
      image: "https://fakeimg.pl/350x200/?text=享樂旅館開幕囉.jpg",
    },
    RoomRequestBody: {
      name: "享樂雙人房",
      description: "享樂雙人房，雙人成行，歡樂加倍",
      imageUrl: "https://fakeimg.pl/350x200/?text=享樂雙人房",
      imageUrlList: ["https://fakeimg.pl/350x200/?text=照片一"],
      areaInfo: "25 坪",
      bedInfo: {
        type: "雙人床",
        quantity: 1,
      },
      maxPeople: 2,
      minPeople: 1,
      price: 10000,
      layoutInfo: [
        {
          title: "市景",
          isProvide: true,
        },
        {
          title: "獨立衛浴",
          isProvide: true,
        },
      ],
      facilityInfo: [
        {
          title: "平面電視",
          isProvide: true,
        },
        {
          title: "衣櫃",
          isProvide: true,
        },
        {
          title: "吹風機",
          isProvide: true,
        },
      ],
      amenityInfo: [
        {
          title: "衛生紙",
          isProvide: true,
        },
        {
          title: "吊衣架",
          isProvide: true,
        },
      ],
    },
    RoomResponses: {
      _id: "6587a5bf67e2dc1d3249b558",
      name: "享樂雙人房",
      description: "享樂雙人房，雙人成行，歡樂加倍",
      imageUrl: "https://fakeimg.pl/350x200/?text=享樂雙人房",
      imageUrlList: ["https://fakeimg.pl/350x200/?text=照片一"],
      areaInfo: "25 坪",
      bedInfo: {
        type: "雙人床",
        quantity: 1,
      },
      maxPeople: 2,
      minPeople: 1,
      price: 10000,
      layoutInfo: [
        {
          title: "市景",
          isProvide: true,
        },
        {
          title: "獨立衛浴",
          isProvide: true,
        },
      ],
      facilityInfo: [
        {
          title: "平面電視",
          isProvide: true,
        },
        {
          title: "衣櫃",
          isProvide: true,
        },
        {
          title: "吹風機",
          isProvide: true,
        },
      ],
      amenityInfo: [
        {
          title: "衛生紙",
          isProvide: true,
        },
        {
          title: "吊衣架",
          isProvide: true,
        },
      ],
      createdAt: "2021-07-14T09:21:43.000Z",
      updatedAt: "2021-07-14T09:21:43.000Z",
    },
    OrderRequestBody: {
      userId: "60f0b4e3f5f4c5b0a8d3e3e9",
      bookingInfo: [
        {
          roomTypeId: "658994aed0a2d285c73e49bc",
          quantity: 1,
          arrivalDate: "2023-12-28T09:21:43.000Z",
          departureDate: "2023-12-28T09:21:43.000Z",
        },
      ],
      guestCount: 2,
      totalPrice: 10000,
      notes: "旅行",
    },
    OrderResponses: {
      _id: "6587a5bf67e2dc1d3249b558",
      userId: "60f0b4e3f5f4c5b0a8d3e3e9",
      bookingInfo: [
        {
          roomTypeId: "658994aed0a2d285c73e49bc",
          quantity: 1,
          arrivalDate: "2023-12-28T09:21:43.000Z",
          departureDate: "2023-12-28T09:21:43.000Z",
        },
      ],
      guestCount: 2,
      isPay: false,
      totalPrice: 10000,
      status: 0,
      notes: "旅行",
      createdAt: "2023-12-28T14:55:04.013Z",
      updatedAt: "2023-12-28T14:55:04.013Z",
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
