const mongoose = require("mongoose")

const videoSchema= new mongoose.Schema({
    title: {
        type: String,
        reqired: true
    },
    video: {
        type: String,
        reqired: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
})

const User = mongoose.model("videos", videoSchemaSchema);

module.exports = Video;