const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const reservationSchema = new mongoose.Schema(
    {
        user: { type: ObjectId, ref: "User" },
        shoe: { type: ObjectId, ref: "Shoe" },
        quantityDays: {
            type: Number
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('Reservation', shoeSchema);