require('dotenv').config();
const sequelize = require('../config/db');
const Medicine = require('../models/Medicine'); // Import directly from Medicine model

const seedmedicines = async () => {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connected');

        const medicines = [
            {
                name: 'Amoxicillin',
                genericName: 'Amoxicillin',
                manufacturer: 'Generic Pharma',
                strength: '500mg',
                form: 'capsule',
                stockQuantity: 100,
                unitPrice: 0.50,
                isActive: true
            },
            {
                name: 'Metformin',
                genericName: 'Metformin HCl',
                manufacturer: 'Diabetes Care',
                strength: '500mg',
                form: 'tablet',
                stockQuantity: 200,
                unitPrice: 0.25,
                isActive: true
            },
            {
                name: 'Lisinopril',
                genericName: 'Lisinopril',
                manufacturer: 'Heart Health',
                strength: '10mg',
                form: 'tablet',
                stockQuantity: 150,
                unitPrice: 0.75,
                isActive: true
            },
            {
                name: 'Ibuprofen',
                genericName: 'Ibuprofen',
                manufacturer: 'Pain Relief Co',
                strength: '400mg',
                form: 'tablet',
                stockQuantity: 80,
                unitPrice: 0.30,
                isActive: true
            },
            {
                name: 'Atorvastatin',
                genericName: 'Atorvastatin Calcium',
                manufacturer: 'Cholesterol Care',
                strength: '20mg',
                form: 'tablet',
                stockQuantity: 120,
                unitPrice: 1.20,
                isActive: true
            },
            {
                name: 'Cetirizine',
                genericName: 'Cetirizine HCl',
                manufacturer: 'Allergy Relief',
                strength: '10mg',
                form: 'tablet',
                stockQuantity: 90,
                unitPrice: 0.40,
                isActive: true
            }
        ];

        // Create medicines if they don't exist
        for (const medicineData of medicines) {
            const existingmedicine = await Medicine.findOne({
                where: { name: medicineData.name, strength: medicineData.strength }
            });

            if (!existingmedicine) {
                await Medicine.create(medicineData); // Fixed: Use Medicine instead of medicine
                console.log(`✅ medicine created: ${medicineData.name} ${medicineData.strength}`);
            } else {
                console.log(`ℹ️ medicine ${medicineData.name} ${medicineData.strength} already exists`);
            }
        }

        console.log('✅ medicine seeding completed successfully');

    } catch (error) {
        console.error('❌ Error seeding medicines:', error);
    } finally {
        // Close database connection
        await sequelize.close();
        process.exit(0);
    }
};

// Run the seed function
seedmedicines();