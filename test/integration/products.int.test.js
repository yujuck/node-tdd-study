// 통합 테스트에서는 데이터베이스 부분도 mock으로 하지 않고 실제 데이터베이스를 사용한다.

const request = require('supertest');
const app = require('../../server');
const newProduct = require('../data/new-product.json');

let firstProduct;

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

  firstProduct = response.body[0];
});

it("GET /api/products/:productId", async () => {
  const response = await request(app).get(`/api/products/${firstProduct._id}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe(firstProduct.name);
  expect(response.body.description).toBe(firstProduct.description);
});

it("GET id doesn't exist /api/products/:productId", async () => {
  const response = await request(app).get('/api/products/5f9f9f9f9f9f9f9f9f9f9f11');  // 형태는 유지해야 500 에러가 나지 않음

  expect(response.statusCode).toBe(404);
})

it("PUT /api/products", async () => {
  const res = await request(app)
    .put(`/api/products/${firstProduct._id}`)
    .send({name: "updated name", description: "updated description"});

  expect(res.statusCode).toBe(200);
  expect(res.body.name).toBe("updated name");
  expect(res.body.description).toBe("updated description");
})

it("should return 404 on PUT /api/products", async () => {
  const res = await request(app)
    .put(`/api/products/5f9f9f9f9f9f9f9f9f9f9f11`)
    .send({name: "updated name", description: "updated description"});
  
    expect(res.statusCode).toBe(404);
})