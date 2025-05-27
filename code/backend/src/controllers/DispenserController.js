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