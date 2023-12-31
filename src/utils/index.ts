import createHttpError from "http-errors";
import jsonWebToken, { type JwtPayload } from "jsonwebtoken";

export const generateToken = (payload: { userId?: string }) => {
  return jsonWebToken.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
};

// 使用 userId 所產生的 token 進行驗證
export const verifyToken = (token: string) => {
  try {
    return jsonWebToken.verify(token, process.env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw createHttpError(403, "請重新登入");
  }
};

export const generateEmailToken = () => {
  const code = generateRandomCode();

  const emailToken = jsonWebToken.sign({ code }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });

  return { code, emailToken };
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
