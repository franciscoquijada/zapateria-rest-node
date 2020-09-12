const mongoose = require("mongoose");
const Shoe = require("../models/shoe");
const { ObjectId } = mongoose.Schema;

/*const CartItemSchema = new mongoose.Schema(
    {
      shoe: { type: ObjectId, ref: "Shoe" },
      name: String,
      price: Number,
      count: Number
    },
    { timestamps: true }
  );
  
  const CartItem = mongoose.model("CartItem", CartItemSchema);*/

const PurchaseSchema = new mongoose.Schema(
  {
    //products: [Shoe],
    documentNo: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: "Not paid",
      enum: ["Not paid", "Paid"]
    },
    updated: Date,
    shoe: { type: ObjectId, ref: "Shoe" },
    user: { type: ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Purchase', PurchaseSchema);
