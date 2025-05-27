const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require('../middleware/checkRole');
const { getAutoDispenseMedicines } = require("../controllers/DispenserController");

AWS.config.update({
  region: 'us-east-1' // or your region
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const iotdata = new AWS.IotData({
  endpoint: process.env.AWS_IOT_ENDPOINT
});

async function getAllDispenserStatuses() {
  const params = {
    TableName: 'DispenserStatus'
  };

  try {
    const data = await dynamodb.scan(params).promise();
    return data.Items; // returns array of dispenser objects
  } catch (err) {
    console.error('Error fetching statuses:', err);
    throw err;
  }
}

router.get('/status', async (req, res) => {
  try {
    const statuses = await getAllDispenserStatuses();
    res.json(statuses);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/available-medicines', authMiddleware, checkRole(['pharmacist', 'doctor']), getAutoDispenseMedicines);

// Backend API endpoint to handle dispenser configuration
router.put('/configure', authMiddleware, async (req, res) => {
  try {
    const { dispenser_name, medicine_id, medication_id } = req.body;
    const medId = medicine_id !== undefined ? medicine_id : medication_id;

    if (!dispenser_name) {
      return res.status(400).json({
        success: false,
        error: 'Dispenser name is required'
      });
    }

    const params = {
      TableName: 'DispenserStatus',
      Key: {
        dispenser_name: dispenser_name
      },
      UpdateExpression: 'SET medicine_id = :medicine_id',
      ExpressionAttributeValues: {
        ':medicine_id': medId
      },
      ReturnValues: 'ALL_NEW'
    };

    if (medId === null) {
      params.UpdateExpression = 'REMOVE medicine_id';
      delete params.ExpressionAttributeValues;
    }

    const result = await dynamodb.update(params).promise();

    res.json({
      success: true,
      message: 'Dispenser configuration updated successfully',
      dispenser: result.Attributes
    });

  } catch (error) {
    console.error('Error updating dispenser configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update dispenser configuration',
      message: error.message
    });
  }
});

router.post('/trigger', authMiddleware, checkRole(['pharmacist']), async (req, res) => {
  try {
    const { prescriptionId, medicines } = req.body;

    if (!medicines || !Array.isArray(medicines)) {
      return res.status(400).json({
        success: false,
        error: 'Medicines array is required'
      });
    }

    console.log('Triggering dispensers for prescription:', prescriptionId);
    console.log('Medicines to dispense:', medicines);

    const dispensingResults = [];
    const errors = [];

    // Process each medicine
    for (const medicine of medicines) {
      try {
        // Find dispenser for this medicine
        const params = {
          TableName: 'DispenserStatus',
          FilterExpression: 'medicine_id = :medicine_id',
          ExpressionAttributeValues: {
            ':medicine_id': medicine.id
          }
        };

        const scanResult = await dynamodb.scan(params).promise();
        
        if (scanResult.Items.length === 0) {
          errors.push(`No dispenser found for medicine ID: ${medicine.id} (${medicine.name})`);
          continue;
        }

        // Get the first matching dispenser (assuming one medicine per dispenser)
        const dispenser = scanResult.Items[0];
        const dispenserName = dispenser.dispenser_name;

        console.log(`Found dispenser ${dispenserName} for medicine ${medicine.name} (ID: ${medicine.id})`);

        // Prepare MQTT message
        const mqttTopic = `mediflow/${dispenserName}/command`;
        const mqttMessage = {
          command: 'dispense',
          medicine_id: medicine.id,
          medicine_name: medicine.name,
          quantity: medicine.quantity || 1,
          prescription_id: prescriptionId,
          timestamp: new Date().toISOString()
        };

        // Send MQTT message
        const mqttParams = {
          topic: mqttTopic,
          payload: JSON.stringify(mqttMessage),
          qos: 1
        };

        await iotdata.publish(mqttParams).promise();
        
        console.log(`MQTT message sent to ${mqttTopic}:`, mqttMessage);

        dispensingResults.push({
          medicine_id: medicine.id,
          medicine_name: medicine.name,
          dispenser_name: dispenserName,
          quantity: medicine.quantity || 1,
          status: 'triggered',
          topic: mqttTopic
        });

      } catch (medicineError) {
        console.error(`Error processing medicine ${medicine.id}:`, medicineError);
        errors.push(`Failed to process medicine ${medicine.name}: ${medicineError.message}`);
      }
    }

    // Prepare response
    const response = {
      success: dispensingResults.length > 0,
      message: `Successfully triggered ${dispensingResults.length} dispenser(s)`,
      prescription_id: prescriptionId,
      dispensing_results: dispensingResults
    };

    if (errors.length > 0) {
      response.errors = errors;
      response.message += `, ${errors.length} error(s) occurred`;
    }

    // Return appropriate status code
    if (dispensingResults.length === 0) {
      return res.status(400).json(response);
    } else if (errors.length > 0) {
      return res.status(207).json(response); // 207 Multi-Status for partial success
    } else {
      return res.status(200).json(response);
    }

  } catch (error) {
    console.error('Error in dispenser trigger endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger dispensers',
      message: error.message
    });
  }
});

module.exports = router;
