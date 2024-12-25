import multer from "multer";

// Set storage options for multer
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + "-" + file.originalname); // Adding timestamp to filename
    }
});

const upload = multer({ storage }); // Apply multer with disk storage configuration

export default upload;