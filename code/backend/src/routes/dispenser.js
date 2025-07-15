const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require('../middleware/checkRole');
const { getAutoDispenseMedicines, triggerDispensers } = require("../controllers/DispenserController");

const rateLimit = require('express-rate-limit');


// Add a rate limiter 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // limit each IP to 10000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." }
});


router.use(limiter);

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

router.post('/trigger', authMiddleware, checkRole(['pharmacist']), triggerDispensers);

module.exports = router;
