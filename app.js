const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

//middlewares
app.use(express.json());
app.use(cors());

// schema design
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for this product"],
    trim: true,
    unique: [true, "Name must be unique"],
    minlength: [3, "Product name must be at least 3 character"],
    maxlength: [100, "Product name cann't be greater than 100 character"],
  },
  description: {
    type: String,
    required: [true, "Description required"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cann't be negative"],
  },
  unit: {
    type: String,
    required: true,
    enum: {
      values: ["kg", "litre", "pcs"],
      message: "Unit value cann't be {VALUE}, must be kg/litre/pcs",
    },
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, "Quantity cann't be negative"],
    validate: {
      validator: (value) => {
        const isInteger = Number.isInteger(value);
        if (isInteger) {
          return true;
        } else {
          return false;
        }
      },
    },
    message: "Quantity must be an integer",
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["in-stock", "out-of-stock", "discontinued"],
      message: "Status cann't be {VALUE}",
    },
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  // updatedAt: {
  //   type: Date,
  //   default: Date.now,
  // },

supplier:{
type: mongoose.Schema.Types.ObjectId,
ref: "Supplier",
},
categories:[{
name:{
type: String,
required: true,
},
_id:mongoose.Schema.Types.ObjectId,
}]
},{timestamps:true});

app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});

module.exports = app;
