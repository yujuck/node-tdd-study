const productModel = require("../models/Product");

exports.createProduct = async (req, res, next) => {
  try {
    const createProduct = await productModel.create(req.body);
    res.status(201).json(createProduct);
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const allProducts = await productModel.find({});
    res.status(200).json(allProducts);
  } catch (err) {
    next(err);
  }
}

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if(!product) {
      res.status(404).send();
    }
    res.status(200).json(product);
  } catch(err) {
    next(err);
  }
};