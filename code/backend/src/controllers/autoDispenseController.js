const AutoDispense = require("../models/autoDispense");
const Prescription = require("../models/Prescription");
const awsIot = require('aws-iot-device-sdk');
const fs = require('fs');

// Get all auto dispense entries
exports.getAllAutoDispense = async (req, res) => {
    try {
        const autoDispense = await AutoDispense.findAll();
        res.json({ autoDispense });
    } catch (error) {
        res.status(500).json({ message: "Error fetching auto dispense data", error: error.message });
    }
};

// Create new auto dispense entry
exports.createAutoDispense = async (req, res) => {
    try {
        const { medicationIds } = req.body;

        if (!medicationIds || !Array.isArray(medicationIds) || medicationIds.length === 0) {
            return res.status(400).json({ message: "Valid medicationIds array is required" });
        }

        const autoDispense = await AutoDispense.create({
            medicationIds
        });

        res.status(201).json({ message: "Auto dispense created", autoDispense });
    } catch (error) {
        res.status(500).json({ message: "Error creating auto dispense", error: error.message });
    }
};

// Update auto dispense entry
exports.updateAutoDispense = async (req, res) => {
    try {
        const { id } = req.params;
        const { medicationIds } = req.body;

        if (!medicationIds || !Array.isArray(medicationIds) || medicationIds.length === 0) {
            return res.status(400).json({ message: "Valid medicationIds array is required" });
        }

        const autoDispense = await AutoDispense.findByPk(id);
        if (!autoDispense) {
            return res.status(404).json({ message: "Auto dispense entry not found" });
        }

        autoDispense.medicationIds = medicationIds;
        await autoDispense.save();

        res.json({ message: "Auto dispense updated", autoDispense });
    } catch (error) {
        res.status(500).json({ message: "Error updating auto dispense", error: error.message });
    }
};

// Delete auto dispense entry
exports.deleteAutoDispense = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await AutoDispense.destroy({ where: { id } });

        if (result === 0) {
            return res.status(404).json({ message: "Auto dispense entry not found" });
        }

        res.json({ message: "Auto dispense deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting auto dispense", error: error.message });
    }
};

exports.triggerAutoDispense = async (req, res) => {
    try {
        const { prescriptionId, medications } = req.body;

        if (!prescriptionId || !medications || !Array.isArray(medications) || medications.length === 0) {
            return res.status(400).json({ message: "Valid prescriptionId and medications array are required" });
        }

        // Create a device client using certificates
        const device = awsIot.device({
            keyPath: process.env.AWS_KEY_PATH,
            certPath: process.env.AWS_CERT_PATH,
            caPath: process.env.AWS_CA_PATH,
            clientId: `mediflow-backend-${Date.now()}`,
            host: process.env.AWS_IOT_ENDPOINT
        });

        // Create unique request ID
        const requestId = Date.now().toString();

        // Wait for connection before publishing
        await new Promise((resolve, reject) => {
            device.on('connect', () => {
                console.log('Connected to AWS IoT Core');
                resolve();
            });

            device.on('error', (err) => {
                console.error('Connection error:', err);
                reject(err);
            });

            // Set a timeout in case connection takes too long
            setTimeout(() => reject(new Error('Connection timeout')), 5000);
        });

        // Prepare and publish messages for each medication
        const publishPromises = medications.map(medication => {
            return new Promise((resolve, reject) => {
                const command = {
                    action: 'dispense',
                    medicationId: medication.id,
                    medicationName: medication.name,
                    quantity: medication.quantity,
                    timestamp: new Date().toISOString(),
                    requestId: requestId,
                    prescriptionId: prescriptionId
                };

                const topic = `mediflow/dispenser/${medication.id}/command`;

                device.publish(topic, JSON.stringify(command), { qos: 1 }, (err) => {
                    if (err) {
                        console.error(`Error publishing to ${topic}:`, err);
                        reject(err);
                    } else {
                        console.log(`Published to ${topic}`);
                        resolve();
                    }
                });
            });
        });

        // Wait for all publish operations to complete
        await Promise.all(publishPromises);

        // End the connection
        device.end(false);

        // Return success response
        res.status(200).json({
            success: true,
            message: "Auto-dispense commands sent successfully",
            requestId: requestId,
            dispenserCount: medications.length
        });
    } catch (error) {
        console.error("Error sending auto-dispense commands:", error);
        res.status(500).json({ message: "Error communicating with dispensers", error: error.message });
    }
};