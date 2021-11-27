// MOHSSINE AIT BOUKDIR - MOHAMMED ALOUT

const mongoose = require("mongoose");

//Le model d'un item(serie)
const itemShema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
}, { timestamps: true })

module.exports = mongoose.model('Item', itemShema);