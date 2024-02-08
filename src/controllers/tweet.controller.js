import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content, owner } = req.body
    if (!content || !owner) {
        throw new ApiError(400, "Both content and owner fields are required.");
    }
    const tweet = await Tweet.create({
        content,
        owner
        })
        return res.status(201).json(new ApiResponse(200,tweet,"Tweet created successfully"))
})
const getUserTweets = asyncHandler(async (req, res) => {

    const getTweet = await Tweet.find({})
    if (getTweet == []){
        throw new ApiError(400,"No Tweets to fetch")
    }
    return res.status(200).json(new ApiResponse(200,getTweet,"Tweets fetch Sucessfully"))
    
})

const updateTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params.tweetId;
    const { content } = req.body; 

    if (!content) {
        throw new ApiError(400, "Content field is required.");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { content },
        { new: true,}
    );

    if (!updatedTweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    res.status(200).json(new ApiResponse(200,updatedTweet,"Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params.tweetId;

   const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

   if (!deletedTweet) {
       throw new ApiError(404, "Tweet not found.");
   }
    res.status(200).json(new ApiResponse(200,"Tweet Deleted successfully"));

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}