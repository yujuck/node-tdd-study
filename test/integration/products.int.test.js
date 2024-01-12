// 통합 테스트에서는 데이터베이스 부분도 mock으로 하지 않고 실제 데이터베이스를 사용한다.

const request = require('supertest');
const app = require('../../server');
const newProduct = require('../data/new-product.json');

it("POST /api/products", async () => {
  const response = await request(app)
    .post("/api/products")
    .send(newProduct);

  expect(response.statusCode).toBe(201);
  expect(response.body.name).toBe(newProduct.name);
  expect(response.body.description).toBe(newProduct.description)
});

it("should return 500 on POST /api/products", async () => {
  const response = await request(app)
    .post("/api/products")
    .send({name: "phone"});
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({message: "Product validation failed: description: Path `description` is required."})
});

it("GET /api/products", async () => {
  const response = await request(app).get("/api/products");

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy();  // value가 true인지 확인
  expect(response.body[0].name).toBeDefined();  // 변수가 undefined가 아닌지 확인
  expect(response.body[0].description).toBeDefined();
});