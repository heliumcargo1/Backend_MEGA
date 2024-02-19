import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    let filter = {};

    // Add filters based on query parameters
    if (query) {
        filter.title = { $regex: query, $options: 'i' };
    }

    if (userId) {
        filter.owner = userId;
    }

    // Set up sorting
    let sort = {};
    if (sortBy && sortType) {
        sort[sortBy] = sortType === 'desc' ? -1 : 1;
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch videos based on filters, sort, and pagination
    const videos = await Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

    if (!videos || videos.length === 0) {
        throw new ApiError(400, "No videos found.");
    }

    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if (
        [title, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const videoLocalPath = req.files.videoFile[0]?.path
    const thumbnailLocalPath = req.files.thumbnail[0]?.path

    if (!videoLocalPath&&!thumbnailLocalPath) {
        throw new ApiError(400, "Both Video file and thumbnail is required")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    
    const videoDetails = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail?.url,
        duration:0
    })
    const createdVideoDetails = await Video.findById(videoDetails._id)

    if (!createdVideoDetails) {
        throw new ApiError(500, "Something went wrong while fetching the video")
    }
    return res.status(201).json(
        new ApiResponse(200, createdVideoDetails, "Video uploaded Successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}