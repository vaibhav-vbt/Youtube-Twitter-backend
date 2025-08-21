import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!videoId?.trim()) {
    throw new ApiError(400, "videoID not recieved");
  }
  console.log("Video ID:", videoId, "Type:", typeof videoId);
  const videoObjectId = new mongoose.Types.ObjectId(videoId);

  const comments = await Comment.aggregate([
    {
      $match: {
        video: videoObjectId,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "CommentOnWhichVideo",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "OwnerOfComment",
      },
    },
    {
      $project: {
        content: 1,
        owner: {
          $arrayElemAt: ["$OwnerOfComment", 0],
        },
        video: {
          $arrayElemAt: ["$CommentOnWhichVideo", 0],
        },
        createdAt: 1,
      },
    },
    {
      $skip: (page - 1) * parseInt(limit),
    },

    {
      $limit: parseInt(limit),
    },
  ]);
  console.log(comments);
  if (!comments?.length) {
    throw new ApiError(404, "Comments not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments Fetched"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  if (!videoId?.trim()) {
    throw new ApiError(400, "VideoID invalid");
  }
  if (!content?.trim()) {
    throw new ApiError(400, "Content Empty");
  }
  const videoIDNew = new mongoose.Types.ObjectId(videoId);

  const addedComment = await Comment.create({
    content,
    owner: req.user?._id,
    video: videoIDNew,
  });
  if (!addedComment) {
    throw new ApiError(500, "Something went wrong while adding comment");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, addedComment, "Comment Added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;
  if (!commentId?.trim()) {
    throw new ApiError(404, "Comment Id is invalid");
  }
  if (!content) {
    throw new ApiError(404, "Content is empty");
  }
  const updatedComment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
      owner: req.user?._id,
    },
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedComment) {
    throw new ApiError(500, "Something went wrong while updating comment");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated succesfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(404, "Comment id Invalid");
  }
  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new ApiError(500, "Internal Error in deleting comment");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
