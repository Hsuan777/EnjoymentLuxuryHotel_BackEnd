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
      avatar: "https://fakeimg.pl/350x200/?text=öㅅö",
    },
    NewsResponses: {
      id: "6587a5bf67e2dc1d3249b558",
      title: "Vic 享樂旅館開幕囉",
      description: "Vic 享樂旅館開幕囉",
      image: "https://fakeimg.pl/350x200/?text=享樂旅館開幕囉",
      createdAt: "2021-07-14T09:21:43.000Z",
      updatedAt: "2021-07-14T09:21:43.000Z",
    },
    NewsRequestBody: {
      title: "Vic 享樂旅館開幕囉",
      description: "Vic 享樂旅館開幕囉",
      image: "https://fakeimg.pl/350x200/?text=享樂旅館開幕囉",
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
