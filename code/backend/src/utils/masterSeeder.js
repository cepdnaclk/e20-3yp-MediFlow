require('dotenv').config();
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function runSeeder(seederPath) {
  console.log(`\n🔄 Running seeder: ${seederPath}\n`);
  try {
    const { stdout, stderr } = await execPromise(`node ${seederPath}`);
    console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    console.error(`❌ Error running ${seederPath}:`, error.message);
    return false;
  }
}

async function runAllSeeders() {
  console.log('📋 Starting database seeding process...');

  //Run flushDb.js 
  const flushSuccess = await runSeeder('src/utils/flushDb.js');
    if (!flushSuccess) {
        console.error('⛔ Failed to flush database. Aborting further seeding.');
        return;
    }
  
  // Run userSeeder.js first (users)
  const usersSuccess = await runSeeder('src/utils/userSeeder.js');
  if (!usersSuccess) {
    console.error('⛔ Failed to seed users. Aborting further seeding.');
    return;
  }
  
  // Run patientSeeder.js second
  const patientsSuccess = await runSeeder('src/utils/patientSeeder.js');
  if (!patientsSuccess) {
    console.error('⛔ Failed to seed patients. Aborting further seeding.');
    return;
  }
  
  // Run prescriptionSeeder.js last
  const prescriptionsSuccess = await runSeeder('src/utils/prescriptionSeeder.js');
  if (!prescriptionsSuccess) {
    console.error('⛔ Failed to seed prescriptions.');
    return;
  }

  // Run autoDispenseSeeder.js last
  const autoDispenseSuccess = await runSeeder('src/utils/autoDispenseSeeder.js');
  if (!autoDispenseSuccess) {
  console.error('⛔ Failed to seed auto-dispense data.');
  return;
  }
  
  console.log('\n✅ All database seeding completed successfully!');
}



// Run all seeders in sequence
runAllSeeders().catch(err => {
  console.error('❌ Master seeder failed:', err);
  process.exit(1);
});