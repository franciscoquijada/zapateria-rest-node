const mongoose = require('mongoose');
//Model of shoes
const modelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 50,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Model', modelSchema);