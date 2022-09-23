const {
  getProductService,
  createProductService,
} = require("../services/product.services");

exports.getProducts = async (req, res, nex) => {
  try {
    const products = await getProductService();
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
