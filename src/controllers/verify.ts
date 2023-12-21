import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import validator from "validator";
import nodemailer from "nodemailer";
import UsersModel from "@/models/user";
import { generateEmailToken } from "@/utils";

// 用於註冊時檢查 Email 是否已被註冊
export const checkEmailExists: RequestHandler = async (req, res, next) => {
  try {
    const email = req.body.email;

    if (!validator.isEmail(email)) {
      throw createHttpError(400, "Email 格式不正確");
    }

    const result = await UsersModel.findOne({ email });

    res.send({
      status: true,
      result: {
        isEmailExists: Boolean(result),
      },
    });
  } catch (error) {
    next();
  }
};

// 用於註冊以及忘記密碼後發送驗證碼，驗證碼會寄到使用者信箱，此驗證碼會暫存至 User verificationToken 欄位
export const sendVerificationCode: RequestHandler = async (req, res, next) => {
  try {
    const email = req.body.email;
    const { code, emailToken } = generateEmailToken();

    const user = await UsersModel.findOneAndUpdate(
      {
        email,
      },
      {
        verificationToken: emailToken,
      },
      {
        new: true,
      }
    );

    if (user) {
      const transporter = await getTransporter();

      await transporter.sendMail({
        from: process.env.EMAILER_USER,
        to: email,
        subject: "享樂旅館 - 安全性驗證碼",
        html: `<p>您在享樂旅館註冊的安全性驗證碼為： ${code}</p><p>若您沒有註冊本旅館會員，請您忽略此訊息。</p>`,
      });
    }

    res.send({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

const getTransporter = async () => {
  const { EMAILER_USER, EMAILER_PASSWORD } = process.env;

  if (!EMAILER_USER || !EMAILER_PASSWORD) {
    throw new Error("Email 服務未啟用");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAILER_USER,
      pass: EMAILER_PASSWORD,
    },
  });

  await transporter.verify();

  return transporter;
};
