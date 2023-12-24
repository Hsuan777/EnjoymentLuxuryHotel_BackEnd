import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import NewsModel from "@/models/new";

export const getNewsList: RequestHandler = async (_req, res, next) => {
  try {
    const result = await NewsModel.find();

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getNewsById: RequestHandler = async (req, res, next) => {
  try {
    const result = await NewsModel.findById(req.params.id);
    if (!result) {
      throw createHttpError(404, "此最新消息不存在");
    }

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const createOneNews: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, image } = req.body;

    const result = await NewsModel.create({
      title,
      description,
      image,
    });

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNewsById: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, image } = req.body;

    const result = await NewsModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!result) {
      throw createHttpError(404, "此最新消息不存在");
    }

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNewsById: RequestHandler = async (req, res, next) => {
  try {
    const result = await NewsModel.findByIdAndDelete(req.params.id);
    if (!result) {
      throw createHttpError(404, "此最新消息不存在");
    }

    res.send({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};
