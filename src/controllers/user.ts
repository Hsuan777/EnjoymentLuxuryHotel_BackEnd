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

export const check: RequestHandler = async (_req, res) => {
  res.send({
    status: true,
  });
};

export const getInfo: RequestHandler = async (req, res) => {
  res.send({
    status: true,
    result: req.user,
  });
};

export const updateInfo: RequestHandler = async (req, res, next) => {
  try {
    // 若有 req.user 有 oldPassword 與 newPassword，則嘗試更新密碼
    await updateUserPassword(req);

    const { userId, name, phone, birthday, isAdmin } = req.body;

    const result = await UsersModel.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        birthday,
        isAdmin,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!result) throw createHttpError(400, "缺少必要欄位");
    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserPassword = async (req: Request) => {
  const { userId, oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return null;
  }

  const user = await UsersModel.findById(userId).select("+password");
  if (!user) {
    throw createHttpError(404, "此使用者不存在");
  }

  const checkPassword = await bcrypt.compare(oldPassword, user.password);
  if (!checkPassword) {
    throw createHttpError(400, "密碼錯誤");
  }

  const result = await UsersModel.findByIdAndUpdate(
    userId,
    {
      password: await bcrypt.hash(newPassword, 6),
    },
    {
      new: true,
    }
  );

  return result;
};
