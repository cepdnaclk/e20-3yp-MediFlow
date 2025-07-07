const request = require("supertest");
const app = require("../index");
const sequelize = require("./config/test-db.config");
const User = require("../models/User");

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe("Auth API Tests", () => {
    it("should register a new user", async () => {
        const res = await request(app).post("/api/auth/register").send({
            username: "testuser",
            email: "test@example.com",
            password: "testpass",
            role: "doctor",
            nic: "123456789V",
            licenseNumber: "DOC123456",
            firstName: "John",
            lastName: "Doe",
            phone: "0712345678",
            specialization: "Cardiology",
            qualifications: "MBBS, MD",
            experience: 5
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("user");
    });

    it("should not register a user with existing email", async () => {
        const res = await request(app).post("/api/auth/register").send({
            username: "testuser",
            email: "test@example.com", // Already used email
            password: "testpass",
            role: "doctor",
            nic: "123456789V",
            licenseNumber: "DOC123456",
            firstName: "John",
            lastName: "Doe",
            phone: "0712345678",
            specialization: "Cardiology",
            qualifications: "MBBS, MD",
            experience: 5
        });

        expect(res.statusCode).toBe(400);
    });

    it("should log in and return a JWT token", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "test@example.com",
            password: "testpass"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });
});