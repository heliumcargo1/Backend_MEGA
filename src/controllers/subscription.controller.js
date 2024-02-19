import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const { userId } = req.user
    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel:channelId
    })
    if (existingSubscription) {
        await existingSubscription.deleteOne();

        return res.status(200).json(new ApiResponse(200,{},"unsubscribed successful"))
    } else {
        const newSubscription = new Subscription({
            subscriber: userId,
            channel:channelId
        })
        await newSubscription.save()
        return res.status(200).json(new ApiResponse(200,{},"subscribed successful"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    
    const channels = await Subscription.find({ channel: channelId }).populate({
        path: 'subscriber',
        select: 'username id avatar' // Select only the fields you need
    })
    
    const subscribers = channels.map(channel => channel.subscriber)
    
    return res.status(200).json(new ApiResponse(200,subscribers,"channels fetch successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
  // Find subscriptions where the subscriber matches the provided subscriberId
  const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate({
    path: 'channel',
    select: 'username id avatar' // Select only the fields you need
});

  // Extract channel details from subscriptions
  const channels = subscriptions.map(subscription => subscription.channel);

return res.status(200).json(new ApiResponse(200,channels,"subscribers fetch successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}