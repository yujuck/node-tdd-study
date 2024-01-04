const productController = require('../../controller/product');
const productModel = require('../../models/Product');

productModel.create = jest.fn();  // 이렇게 하면 productModel의 create 함수가 실제로 호출되었는지 안되었는지를 spy 할 수 있음

describe('Product Controller Create', () => {
    it('should have a createProduct function', () => {
        expect(typeof productController.createProduct).toBe("function");
    });

    it('should call ProductModel.create', () => {
        productController.createProduct();
        expect(productModel.create).toBeCalled();
    })
});