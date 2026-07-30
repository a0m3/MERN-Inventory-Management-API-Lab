require("dotenv").config({ path: ".env.test" });

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const Products = require("../models/Products");

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterEach(async () => {
    await Products.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Products API", () => {

    describe("POST /products", () => {

        test("should create a new product", async () => {

            const response = await request(app)
                .post("/products")
                .send({
                    title: "Wireless Keyboard",
                    description: "Bluetooth mechanical keyboard",
                    category: "Electronics",
                    price: 49.99,
                    quantity: 20
                });

            expect(response.statusCode).toBe(201);

            expect(response.body.title).toBe("Wireless Keyboard");
            expect(response.body.description).toBe("Bluetooth mechanical keyboard");
            expect(response.body.category).toBe("Electronics");
            expect(response.body.price).toBe(49.99);
            expect(response.body.quantity).toBe(20);

        });

        test("should return 400 if validation fails", async () => {

            const response = await request(app)
                .post("/products")
                .send({
                    title: "",
                    price: -5
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBeDefined();

        });

    });

    describe("GET /products", () => {

        test("should return all products", async () => {

            await Products.create({
                title: "Wireless Keyboard",
                description: "Bluetooth mechanical keyboard",
                category: "Electronics",
                price: 49.99,
                quantity: 20
            });

            const response = await request(app)
                .get("/products");

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);

        });

        test("should return an empty array when there are no products", async () => {

            const response = await request(app)
                .get("/products");

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);

        });

    });

    describe("GET /products/:productId", () => {

        test("should return one product", async () => {

            const product = await Products.create({
                title: "Wireless Keyboard",
                description: "Bluetooth mechanical keyboard",
                category: "Electronics",
                price: 49.99,
                quantity: 20
            });

            const response = await request(app)
                .get(`/products/${product._id}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.title).toBe("Wireless Keyboard");
            expect(response.body.description).toBe("Bluetooth mechanical keyboard");
            expect(response.body.category).toBe("Electronics");

        });

        test("should return 404 for invalid ObjectId", async () => {

            const response = await request(app)
                .get("/products/not-a-valid-id");

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Product ID is not valid");

        });

        test("should return 404 when product does not exist", async () => {

            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .get(`/products/${fakeId}`);

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Product ID is not valid");

        });

    });

    describe("PUT /products/:productId", () => {

        test("should update a product", async () => {

            const product = await Products.create({
                title: "Wireless Keyboard",
                description: "Bluetooth mechanical keyboard",
                category: "Electronics",
                price: 49.99,
                quantity: 20
            });

            const response = await request(app)
                .put(`/products/${product._id}`)
                .send({
                    title: "Gaming Keyboard",
                    description: "RGB Mechanical Keyboard",
                    category: "Electronics",
                    price: 79.99,
                    quantity: 15
                });

            expect(response.statusCode).toBe(200);

            expect(response.body.title).toBe("Gaming Keyboard");
            expect(response.body.description).toBe("RGB Mechanical Keyboard");
            expect(response.body.category).toBe("Electronics");
            expect(response.body.price).toBe(79.99);
            expect(response.body.quantity).toBe(15);

        });

        test("should return 404 for invalid ObjectId", async () => {

            const response = await request(app)
                .put("/products/abc123")
                .send({
                    title: "Gaming Keyboard"
                });

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Product ID is not valid");

        });

        test("should return 404 when product does not exist", async () => {

            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .put(`/products/${fakeId}`)
                .send({
                    title: "Gaming Keyboard",
                    description: "RGB Mechanical Keyboard",
                    category: "Electronics",
                    price: 79.99,
                    quantity: 15
                });

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Product ID is not valid");

        });

    });

    describe("DELETE /products/:productId", () => {

        test("should delete a product", async () => {

            const product = await Products.create({
                title: "Wireless Keyboard",
                description: "Bluetooth mechanical keyboard",
                category: "Electronics",
                price: 49.99,
                quantity: 20
            });

            const response = await request(app)
                .delete(`/products/${product._id}`);

            expect(response.statusCode).toBe(200);

            const deletedProduct = await Products.findById(product._id);

            expect(deletedProduct).toBeNull();

        });

        test("should return 404 for invalid ObjectId", async () => {

            const response = await request(app)
                .delete("/products/not-valid-id");

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Product ID is not valid");

        });

        test("should return 404 when product does not exist", async () => {

            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .delete(`/products/${fakeId}`);

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("No Product with this ID to delete");

        });

    });

});