import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import RoomModel from "@/models/room";

export const getRoomList: RequestHandler = async (_req, res, next) => {
  try {
    const result = await RoomModel.find({
      status: 1,
    });

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRoomById: RequestHandler = async (req, res, next) => {
  try {
    const result = await RoomModel.findOne({
      _id: req.params.id,
      status: 1,
    });
    if (!result) {
      throw createHttpError(404, "此房型不存在");
    }

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const createOneRoom: RequestHandler = async (req, res, next) => {
  try {
    const {
      name,
      description,
      imageUrlList,
      imageUrl,
      areaInfo,
      bedInfo,
      maxPeople,
      minPeople,
      price,
      layoutInfo,
      facilityInfo,
      amenityInfo,
      availableQuantity,
    } = req.body;

    const result = await RoomModel.create({
      name,
      description,
      imageUrl,
      imageUrlList,
      areaInfo,
      bedInfo,
      maxPeople,
      minPeople,
      price,
      layoutInfo,
      facilityInfo,
      amenityInfo,
      availableQuantity,
    });

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoomById: RequestHandler = async (req, res, next) => {
  try {
    const {
      name,
      description,
      imageUrl,
      imageUrlList,
      areaInfo,
      bedInfo,
      maxPeople,
      minPeople,
      price,
      layoutInfo,
      facilityInfo,
      amenityInfo,
      availableQuantity,
    } = req.body;

    const result = await RoomModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        imageUrl,
        imageUrlList,
        areaInfo,
        bedInfo,
        maxPeople,
        minPeople,
        price,
        layoutInfo,
        facilityInfo,
        amenityInfo,
        availableQuantity,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!result) {
      throw createHttpError(404, "此房型不存在");
    }

    res.send({
      status: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoomById: RequestHandler = async (req, res, next) => {
  try {
    const result = await RoomModel.findByIdAndUpdate(
      req.params.id,
      {
        status: -1,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!result) {
      throw createHttpError(404, "此房型不存在");
    }

    res.send({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};
