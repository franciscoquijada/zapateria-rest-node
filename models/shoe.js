const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const shoeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        quantity: {
            type: Number
        },
        model: {
            type: ObjectId,
            ref: "Model",
            required: true
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        colour: {
            type: String,
        },
        size: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('Shoe', shoeSchema);