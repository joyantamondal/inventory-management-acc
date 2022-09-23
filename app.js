const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

//middlewares
app.use(express.json());
app.use(cors());

// schema design created
const productSchema = mongoose.Schema(
  {
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

    // supplier: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Supplier",
    // },
    // categories: [
    //   {
    //     name: {
    //       type: String,
    //       required: true,
    //     },
    //     _id: mongoose.Schema.Types.ObjectId,
    //   },
    // ],
  },
  { timestamps: true }
);

// mongoose middleware for saving data : pre/post
productSchema.pre('save',function(next){
console.log('Before saving data');
if(this.quantity===0){
this.status ='out-of-stock'
}
next()
})

// productSchema.post('save',function(doc,next){
//   console.log('After saving data');
//   next()
//   })
productSchema.methods.logger=function(){
console.log(`Data Saved for ${this.name}`)
}
// Schema -> Model-> Query
// model create 
const Product = mongoose.model("Product", productSchema);

app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});

//posting to database
app.post("/api/v1/product", async(req, res, next) => {
  try{
    // create method 
    const result = await Product.create(req.body);
    result.logger()
    // save  method 
    // const product = new Product(req.body);
    // const result= await product.save();
    res.status(200).json({
    status:"success",
    message: "Data inserted successfully",
    data: result
    })
  }
  catch(error){
    res.status(400).json({
   status:"Fail",
   message:"Data is not inserted",
   error: error.message
    })
  }
});

app.get("/api/v1/product", async(req,res,nex)=>{
try{
  const products = await Product.find({_id:'632a029da8054c85e92d073a'})
  res.status(200).json({
  status:'Success',
  data:products
  })

}
catch(error){
res.status(400).json({
status:"fail",
message:'can not get data',
error: error.message
})
}
})
module.exports = app;
