import { v2 as cloudinary} from "cloudinary";
import fs from "fs"
          
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        // upload file 
 const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
        // file hasbeen uploaded sucessfully.
        console.log("File is uploaded on clodinary", response.url);
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath) //removed the locally temp file as the uplode opertion fails
    }
}

export {uploadOnCloudinary}