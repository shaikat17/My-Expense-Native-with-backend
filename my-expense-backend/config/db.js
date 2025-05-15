import mongoose from 'mongoose';
import envConfig from './envConfig.js';

const connectDB = async () => {
  try {
    await mongoose.connect(envConfig.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
