import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh fields from response
    // check for user creation
    // return response
    
    const { fullName, email, username, password } = req.body
    console.log("email", email);
    
    // if (fullName === "") {
    //     throw new ApiError(400, "Full Name is Required")
    // }
    if (
        [fullName, email, username, password].some((field) => 
            field?.trim()===""
        )
    ) {
        throw ApiError(400, "All fields are required")
    }


   const existedUser = User.findOne({
    $or:[{username},{email}]
    })
    if (existedUser) {
        throw new ApiError(409,"User With email or username already exists")
    }

    const avatarLOcalPath =  req.files?.avatar[0]?.path
    const coverImageLOcalPath = req.files?.coverImage[0]?.path
    
    if (!avatarLOcalPath) {
        throw new ApiError(400,"AVatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLOcalPath)
    const coverImage = await uploadOnCloudinary(coverImageLOcalPath)
    
    if (!avatar) {
        throw new ApiError(400,"AVatar file is required")
    }

   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken")
    
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong when registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export {registerUser}