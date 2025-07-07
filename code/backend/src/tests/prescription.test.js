const request = require("supertest");
const app = require("../index");
const sequelize = require("./config/test-db.config");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe("Prescription API Tests", () => {
    let doctorToken;
    let pharmacistToken;

    beforeEach(async () => {
        // Clear users before each test
        await User.destroy({ truncate: true });

        // Create a test doctor
        const hashedPassword = await bcrypt.hash("password", 10);
        const doctor = await User.create({
            username: "testdoctor",
            email: "doctor@test.com",
            password: hashedPassword,
            role: "doctor",
            nic: "123456789V",           // Added
            licenseNumber: "DOC123456"   // Added
        });
        doctorToken = jwt.sign(
            { id: doctor.id, role: doctor.role },
            process.env.JWT_SECRET
        );

        // Create a test pharmacist
        const pharmacist = await User.create({
            username: "testpharmacist",
            email: "pharmacist@test.com",
            password: hashedPassword,
            role: "pharmacist",
            nic: "987654321V",           // Added
            licenseNumber: "PHARM123456" // Added
        });
        pharmacistToken = jwt.sign(
            { id: pharmacist.id, role: pharmacist.role },
            process.env.JWT_SECRET
        );
    });

    it("should allow doctor to create prescription", async () => {
        const res = await request(app)
            .post("/api/prescriptions")
            .set("Authorization", `Bearer ${doctorToken}`)
            .send({
                patientId: "P123456",
                patientName: "Test Patient",
                age: 45,
                allergies: ["None"],
                diagnosis: "Test Diagnosis",
                prescriptionDate: new Date().toISOString().split('T')[0],
                medicines: [
                    {
                        id: 1,
                        name: "Test Medicine",
                        dosage: "250mg",
                        frequency: "Twice daily",
                        duration: "7 days",
                        quantity: 14
                    }
                ]
            });

        expect(res.statusCode).toBe(201);
    });

    it("should not allow pharmacist to create prescription", async () => {
        const res = await request(app)
            .post("/api/prescriptions")
            .set("Authorization", `Bearer ${pharmacistToken}`)
            .send({
                patientId: "123",
                medicines: ["med1", "med2"]
            });

        expect(res.statusCode).toBe(403);
    });

    it("should allow both doctor and pharmacist to view prescriptions", async () => {
        const doctorRes = await request(app)
            .get("/api/prescriptions")
            .set("Authorization", `Bearer ${doctorToken}`);

        const pharmacistRes = await request(app)
            .get("/api/prescriptions")
            .set("Authorization", `Bearer ${pharmacistToken}`);

        expect(doctorRes.statusCode).toBe(200);
        expect(pharmacistRes.statusCode).toBe(200);
    });

    // Uncomment and adjust these tests if your API supports prescription status updates

    // it("should allow pharmacist to update prescription status", async () => {
    //     // First create a prescription as doctor
    //     const prescription = await request(app)
    //         .post("/api/prescriptions")
    //         .set("Authorization", `Bearer ${doctorToken}`)
    //         .send({
    //             patientId: "P123456",
    //             patientName: "Test Patient",
    //             age: 45,
    //             allergies: ["None"],
    //             diagnosis: "Test Diagnosis",
    //             prescriptionDate: new Date().toISOString().split('T')[0],
    //             medicines: [
    //                 {
    //                     id: 1,
    //                     name: "Test Medicine",
    //                     dosage: "250mg",
    //                     frequency: "Twice daily",
    //                     duration: "7 days",
    //                     quantity: 14
    //                 }
    //             ]
    //         });

    //     // Then update status as pharmacist
    //     const res = await request(app)
    //         .patch(`/api/prescriptions/${prescription.body.prescription.id}/status`)
    //         .set("Authorization", `Bearer ${pharmacistToken}`)
    //         .send({ status: "dispensed" });

    //     expect(res.statusCode).toBe(200);
    //     expect(res.body.prescription.status).toBe("dispensed");
    // });

    // it("should not allow doctor to update prescription status", async () => {
    //     const prescription = await request(app)
    //         .post("/api/prescriptions")
    //         .set("Authorization", `Bearer ${doctorToken}`)
    //         .send({
    //             patientId: "123",
    //             medicines: ["med1", "med2"]
    //         });

    //     const res = await request(app)
    //         .patch(`/api/prescriptions/${prescription.body.prescription.id}/status`)
    //         .set("Authorization", `Bearer ${doctorToken}`)
    //         .send({ status: "dispensed" });

    //     expect(res.statusCode).toBe(403);
    //
});