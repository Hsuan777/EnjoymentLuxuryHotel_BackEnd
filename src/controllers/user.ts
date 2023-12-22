import type { Request, RequestHandler } from "express";
import UsersModel from "@/models/user";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "@/utils";

export const signup: RequestHandler = async (req: Request, res, next) => {
  try {
    const { name, email, password, phone, birthday } = req.body;

    const checkEmail = await UsersModel.findOne({ email });
    if (checkEmail) throw createHttpError(400, "此 Email 已註冊");

    const _user = await UsersModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 6),
      phone,
      birthday,
    });

    // password 不使用，因此使用 _ 代替
    const {
      password: _,
      email: _email,
      phone: _phone,
      birthday: _birthday,
      verificationToken: _verificationToken,
      ...user
    } = _user.toObject();

    res.send({
      status: true,
      token: generateToken({ userId: user._id }),
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const _user = await UsersModel.findOne({ email }).select("+password");
    if (!_user) throw createHttpError(400, "此使用者不存在");

    const checkPassword = await bcrypt.compare(password, _user.password);
    if (!checkPassword) throw createHttpError(400, "密碼錯誤");

    const { password: _, ...user } = _user.toObject();

    res.send({
      status: true,
      token: generateToken({ userId: user._id }),
      user,
    });
  } catch (error) {
    next(error);
  }
};

// 用於忘記密碼時，驗證信箱驗證碼是否正確，若正確則將新密碼更新至資料庫
export const forget: RequestHandler = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await UsersModel.findOne({ email }).select(
      "+verificationToken"
    );
    if (!user) {
      throw createHttpError(404, "此使用者不存在");
    }

    const payload = verifyToken(user.verificationToken);

    if (payload.code === code) {
      await UsersModel.findByIdAndUpdate(
        user._id,
        {
          password: await bcrypt.hash(newPassword, 6),
          verificationToken: "",
        },
        {
          new: true,
        }
      );
    } else {
      throw createHttpError(400, "驗證碼錯誤");
    }

    res.send({
      status: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
