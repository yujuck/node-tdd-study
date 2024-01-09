const productController = require("../../controller/product");
const productModel = require("../../models/Product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");

productModel.create = jest.fn(); // 이렇게 하면 productModel의 create 함수가 실제로 호출되었는지 안되었는지를 spy 할 수 있음

let req, res, next;
// 모든 테스트 전에 실행되는 beforeEach
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
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
});
