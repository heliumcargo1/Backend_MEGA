
import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({

    subscriber: {
        type: Schema.Types.ObjectId, //one who is subscribing
        ref: "User",
        
    },
    channel: {
        type: Schema.Types.ObjectId, //one to whome the subscriber is ubscribing
        ref: "User",
    }
},{timestamps:true})
export const Subscription = new mongoose.model("Subscription",subscriptionSchema)