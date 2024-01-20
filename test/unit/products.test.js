const productController = require("../../controller/product");
const productModel = require("../../models/Product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");
const allProducts = require("../data/all-product.json");

productModel.create = jest.fn(); // 이렇게 하면 productModel의 create 함수가 실제로 호출되었는지 안되었는지를 spy 할 수 있음
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

let req, res, next;
const productId = "dfadfadf89dflkjal";
const updatedProduct = { name: "updated name", description: "updated description" };

// 모든 테스트 전에 실행되는 beforeEach
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("Product Controller Create", () => {
  // Product Controller Create 내부에서만 적용되는 beforeEach
  beforeEach(() => {
    req.body = newProduct;
  });

  it("should have a createProduct function", () => {
    expect(typeof productController.createProduct).toBe("function");
  });

  it("should call ProductModel.create", async () => {
    await productController.createProduct(req, res, next);
    expect(productModel.create).toBeCalledWith(newProduct);
  });

  it("should return 201 response code", async () => {
    await productController.createProduct(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy(); // _isEndCalled()는 res.send()가 호출되었는지를 확인하는 함수 (node-mocks-http의 기능)
  });

  it("should return json body in response", async () => {
    productModel.create.mockReturnValue(newProduct);
    await productController.createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct); // _getJSONData()는 전달된 데이터를 확인하는 함수 (node-mocks-http의 기능)
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "description property missing" };
    const rejectedPromise = Promise.reject(errorMessage);  // 비동기 요청에 대한 결과 값은 성공할 때는 Promise.resolve(value), 에러일 때는 Promise.reject(reason)
    productModel.create.mockReturnValue(rejectedPromise);
    await productController.createProduct(req, res, next);
    expect(next).toBeCalledWith(errorMessage);  // next 함수가 에러 메시지를 인자로 호출되었는지 확인
  });
});

describe("ProductController Get", () => {
  it("should have a getProducts function", () => {
    expect(typeof productController.getProducts).toBe("function");
  });

  it("should call ProductModel.find({})", async () => {
    await productController.getProducts(req, res, next);
    
    expect(productModel.find).toHaveBeenCalledWith({});
  })

  it("should return 200 response", async () => {
    await productController.getProducts(req, res, next);
    
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });

  it("should return json body in response", async () => {
    productModel.find.mockReturnValue(allProducts);
    await productController.getProducts(req,res,next);
    
    expect(res._getJSONData).toStrictEqual(allProducts);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error finding product data" };
    const rejectedPromise = Promise.reject(errorMessage);

    productController.find.mockReturnValue(rejectedPromise);
    await productController.getProducts(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("Product Controller GetById", () => {
  it("should have a getProductById", () => {
    expect(typeof productController.getProductById).toBe("function");
  });

  it("should call ProductModel.findById", async () => {
    req.params.productId = productId;
    await productController.getProductById(req, res, next);

    expect(productModel.findById).toBeCalledWith(productId);
  });

  it("should return json body and response code 200", async () => {
    productModel.findById.mockReturnValue(newProduct);
    await productController.getProductById(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return 404 when item doesn't exist", async ()=> {
    productModel.findById.mockReturnValue(null);
    await productController.getProductById(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = {message: "error"};
    const rejectedPromise = Promise.reject(errorMessage);

    productModel.findById.mockReturnValue(rejectedPromise);

    await productController.getProductById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Controller Update", () => {
  it("should have an updateProduct function", () => {
    expect(typeof productController.updateProduct).toBe("function");
  });

  it("should call ProductModel.findByIdAndUpdate", async () => {
    req.params.productId = productId;
    req.body = updatedProduct;
    await productController.updateProduct(req, res, next);

    expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
      productId, updatedProduct,
      {new: true}
    );
  });

  it("should return json body and response code 200", async () => {
    req.params.productId = productId;
    req.body = updatedProduct;
    productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
    await productController.updateProduct(req, res, next);
    
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(updatedProduct);
  });

  it("should handle 404 when item doesn't exist", async () => {
    productModel.findByIdAndUpdate.mockReturnValue(null);
    await productController.updateProduct(req, res, next);
    
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = {message: "error"};
    const rejectPromise = Promise.reject(errorMessage);
    productModel.findByIdAndUpdate.mockReturnValue(rejectPromise);
    await productController.updateProduct(req, res, next);
    
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Controller Delete", () => {
  it("should have a deleteProduct function", () => {
    expect(typeof productController.deleteProduct).toBe("function");
  })

  it("should call ProductModel.findByIdAndDelete", async () => {
    req.params.productId = productId;
    await productController.deleteProduct(req, res, next);
    
    expect(productMdodle.findByIdAndDelete).toBeCalledWith(productId)
  })

  it("should return 200 response", async () => {
    let deletedProduct = {
      name: "deletedProduct",
      description: "it is deleted"
    }
    productModel.findByIdAndDelete.mockReturnValue(deletedProduct);
    await productController.deleteProduct(req, res, next);

    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(deletedProduct);
    expect(res._isEndCalled()).toBeTruthy();
  })

  it("should handle 404 when item doesnt exist", async () => {
    productModel.findByIdAndDelete.mockReturnValue(null);
    await productController.deleteProduct(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  })

  it("should handle errors", async () => {
    const errorMessage = {message: "Error deleting"};
    const rejectedPromise = Promise.reject(errorMessage);

    productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await productController.deleteProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  })
})