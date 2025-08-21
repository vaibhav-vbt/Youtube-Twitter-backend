import mongoose, { isValidObjectId, plugin } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist
  if (!name) {
    throw new ApiError(400, "Name of playlist not recieved");
  }
  if (!description) {
    throw new ApiError(400, "Description of playlist not recieved");
  }
  const playlist = await Playlist.create({
    name,
    description,
    owner: req?.user,
  });
  if (!playlist) {
    throw new ApiError(500, "Couldnt create new playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, " PLaylist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const playlists = await Playlist.find({ owner: userId });

  if (!playlists) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "User playlists fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!playlistId) {
    throw new ApiError(400, "Playlist id not recieved");
  }
  const playlist = await Playlist.findById(playlistId).populate("videos");
  if (!playlist) {
    throw new ApiError(404, "no playlist found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, "Playlist id not recieved");
  }
  if (!videoId) {
    throw new ApiError(400, "videoId id not recieved");
  }
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $addToSet: { videos: videoId } }, // $addToSet avoids duplicates
    { new: true }
  );
  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found or video already added");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video added to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist or video ID");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      new: true,
    }
  );
  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video removed from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

  if (!deletedPlaylist) {
    throw new ApiError(404, "Playlist not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist updated successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  if (!name || !description) {
    throw new ApiError(400, "Name or description cannot be empty");
  }

  const updatedPlaylistDoc = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedPlaylistDoc) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylistDoc, "Playlist updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
