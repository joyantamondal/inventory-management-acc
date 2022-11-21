const Product = require("../models/Product");
const {
  getProductService,
  createProductService,
  updateProductByIdService,
  bulkUpdateProductService,
  deleteProductByIdService,
  bulkDeleteProductService,
} = require("../services/product.services");

exports.getProducts = async (req, res, nex) => {
  try {
    const filters = { ...req.query };

    //sort , page, limit -> exclude
    const excludeFields = ["sort", "page", "limit"];
    excludeFields.forEach((field) => delete filters[field]);
    const quries = {}
    if(req.query.sort){
      // price, quantity -> 'price quantity'
    const sortBy = req.query.sort.split(',').join(' ');
    quries.sortBy = sortBy;
    console.log(sortBy);
    }

    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      quries.fields = fields;
      console.log(fields)
    }
    const products = await getProductService(filters,quries);
    res.status(200).json({
      status: "Success",
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can not get data",
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    // create method / save method
    const result = await createProductService(req.body);
    result.logger();
    res.status(200).json({
      status: "success",
      message: "Data inserted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Data is not inserted",
      error: error.message,
    });
  }
};

exports.updateProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await updateProductByIdService(id, req.body);
    res.status(200).json({
      status: "success",
      message: "Product successfully updated!",
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Couldn't update a product",
      error: error.message,
    });
  }
};

exports.bulkUpdateProduct = async (req, res, next) => {
  try {
    const result = await bulkUpdateProductService(req.body);
    res.status(200).json({
      status: "success",
      message: "Product successfully updated!",
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Couldn't update a product",
      error: error.message,
    });
  }
};

exports.deleteProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteProductByIdService(id);
    if (!result.deletedCount) {
      return res.status(400).json({
        status: "fail",
        error: "Couldn't delete the product",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Product successfully Deleted!",
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Couldn't delete product",
      error: error.message,
    });
  }
};

exports.bulkDeleteProduct = async (req, res, next) => {
  try {
    const result = await bulkDeleteProductService(req.body.ids);
    res.status(200).json({
      status: "success",
      message: "Successfully deleted the given products!",
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Couldn't deleted  the given products!",
      error: error.message,
    });
  }
};
