import mongoose from 'mongoose';
import { config } from './config';
import Logging from '../library/Logging';

export async function dbconnect() {
  try {
    await mongoose.connect(config.MONGO_URL as string);
    Logging.log(`Connected to MongoDB at ${config.MONGO_DB}`);
  } catch (error) {
    Logging.error(`Error connecting to MongoDB: ${error}}` );
  }
}