// import createHttpError from "http-errors";
import jsonWebToken, { type JwtPayload } from "jsonwebtoken";

export const generateToken = (payload: { userId?: string }) => {
  return jsonWebToken.sign(payload, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
};

export const generateEmailToken = () => {
  const code = generateRandomCode();

  const token = jsonWebToken.sign({ code }, process.env.JWT_SECRET || "", {
    expiresIn: 3600,
  });

  return { code, token };
};

const generateRandomCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};
