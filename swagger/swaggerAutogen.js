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
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
