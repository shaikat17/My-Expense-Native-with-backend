import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
    PORT: process.env.PORT || 3000,
    mongoURI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
};

export default envConfig;