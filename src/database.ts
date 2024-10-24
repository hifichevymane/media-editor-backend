import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_ROOT_USERNAME = process.env.MONGO_ROOT_USERNAME;
const MONGO_ROOT_PASSWORD = process.env.MONGO_ROOT_PASSWORD;
const MONGO_CONTAINER_NAME = process.env.MONGO_CONTAINER_NAME;
const MONGO_PORT = process.env.MONGO_PORT;
const DATABASE_CONNECTION_URL = `mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@${MONGO_CONTAINER_NAME}:${MONGO_PORT}/`;

const connectToDb = () => {
  return mongoose.connect(DATABASE_CONNECTION_URL);
};

export default connectToDb;
