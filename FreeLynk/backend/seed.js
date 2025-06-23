const mongoose = require('mongoose');
const { seedDatabase } = require('./utils/seedData');

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://studentAdmin1:8PtyQNZFIMtnjhVM@cluster0.hpoj4.mongodb.net/freelynkDB';

console.log('🌱 Starting database seeding process...');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedDatabase();
    console.log('🎉 Seeding completed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  }); 