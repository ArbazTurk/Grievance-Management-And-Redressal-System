const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dxi0ch7bk",
    api_key: "675419342567276",
    api_secret: "dyFd_uRRYer2cbWPpjKxqMXDn84",
  });

const uploadFile = async (filePath) => {
    try{
        const result = await cloudinary.uploader.upload(filePath);
        return result
    }catch(err){
        console.log(err)
    }
}

module.exports = { uploadFile }