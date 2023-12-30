import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import CulinaryModel from "@/models/culinary";

export const getCulinaryList: RequestHandler = async (_req, res, next) => {
  try {
    const result = await CulinaryModel.find();

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCulinaryById: RequestHandler = async (req, res, next) => {
  try {
    const result = await CulinaryModel.findById(req.params.id);
    if (!result) {
      throw createHttpError(404, "此佳餚不存在");
    }
    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const createCulinary: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, diningTime, image } = req.body;

    const result = await CulinaryModel.create({
      title,
      description,
      diningTime,
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

export const updateCulinaryById: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, diningTime, image } = req.body;

    const result = await CulinaryModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        diningTime,
        image,
      },
      {
        new: true,
      }
    );

    if (!result) {
      throw createHttpError(404, "此佳餚不存在");
    }

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCulinaryById: RequestHandler = async (req, res, next) => {
  try {
    const result = await CulinaryModel.findByIdAndDelete(req.params.id);
    if (!result) {
      throw createHttpError(404, "此佳餚不存在");
    }
    res.send({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};
