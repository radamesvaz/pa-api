const cloudinary = require('cloudinary');
const  dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: 755953186971795,
    api_secret: _H-Y5tD1ID4ozcZryu7OV_4Irns
});

exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder:folder
        })
    })
}