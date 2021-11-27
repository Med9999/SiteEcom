// MOHSSINE AIT BOUKDIR - MOHAMMED ALOUT

const mongoose = require("mongoose");
const Item = require("../models/Item")

//Le model d'une facture
const factureShema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Item,
    }
}, { timestamps: true })

module.exports = mongoose.model('Facture', factureShema);