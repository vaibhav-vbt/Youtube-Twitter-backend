import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const user = req.user;
  const totalVideoAndView = await Video.aggregate([
    {
      $match: {
        owner: user?._id,
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
      },
    },
  ]);
  const totalSubscriber = await Subscription.countDocuments({
    channel: user?._id,
  });
  const totalLikes = Like.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoInfo",
      },
    },
    { $unwind: "$videoInfo" },
    { $match: { "videoInfo.owner": user?._id } },
    { $count: "totalLikes" },
  ]);
  if (!totalVideoAndView) {
    throw new ApiError(500, "Couldnt get video or view details");
  }
  if (!totalLikes) {
    throw new ApiError(500, "Couldnt get like details");
  }
  if (!totalSubscriber) {
    throw new ApiError(500, "Couldnt get Subscriber details");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalLikes, totalSubscriber, totalVideoAndView },
        "Dashboard details fetched successfully"
      )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const user = req.user;
  const allVideos = await Video.aggregate([
    {
      $match: {
        owner: user?._id,
      },
    },
  ]);
  if (!allVideos) {
    throw new ApiError(500, "couldnt fetch videos");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, allVideos, "all videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
