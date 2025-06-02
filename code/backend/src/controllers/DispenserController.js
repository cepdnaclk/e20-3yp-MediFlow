const AWS = require('aws-sdk');

// Configure AWS DynamoDB
const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Get auto-dispense medicines from DynamoDB DispenserStatus table
exports.getAutoDispenseMedicines = async (req, res) => {
    try {
        const params = {
            TableName: 'DispenserStatus' // Your DynamoDB table name
        };

        const result = await dynamodb.scan(params).promise();
        
        // Extract medicine IDs from all dispensers that are online
        const autoDispenseMedicineIds = result.Items
            .filter(item => 
                item.status === 'online' // Only include online dispensers
            )
            .map(item => item.medicine_id); // Use medicine_id field from your structure

        console.log('Auto-dispense medicine IDs from DynamoDB DispenserStatus:', autoDispenseMedicineIds);
        console.log('Total dispensers found:', result.Items.length);
        console.log('Online dispensers:', autoDispenseMedicineIds.length);

        res.json({ 
            autoDispenseMedicineIds, // Updated variable name
            dispensers: result.Items 
        });
    } catch (error) {
        console.error('Error fetching auto-dispense medicines from DynamoDB:', error);
        res.status(500).json({ 
            message: "Error fetching auto-dispense medicines", 
            error: error.message 
        });
    }
};

exports.triggerDispensers = async (req, res) => {
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

    const AWS = require('aws-sdk');
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const iotdata = new AWS.IotData({
      endpoint: process.env.AWS_IOT_ENDPOINT
    });

    const dispensingResults = [];
    const errors = [];

    for (const medicine of medicines) {
      try {
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

        const dispenser = scanResult.Items[0];
        const dispenserName = dispenser.dispenser_name;

        console.log(`Found dispenser ${dispenserName} for medicine ${medicine.name} (ID: ${medicine.id})`);

        const mqttTopic = `mediflow/${dispenserName}/command`;
        const mqttMessage = {
          command: 'dispense',
          medicine_id: medicine.id,
          medicine_name: medicine.name,
          quantity: medicine.quantity || 1,
          prescription_id: prescriptionId,
          timestamp: new Date().toISOString()
        };

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

    if (dispensingResults.length === 0) {
      return res.status(400).json(response);
    } else if (errors.length > 0) {
      return res.status(207).json(response);
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
};