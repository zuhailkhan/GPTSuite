import dotenv from "dotenv";

dotenv.config();
const App_Name = "arbit-cluster-main";
const MONGO_USERNAME = process.env.MONGO_USERNAME!;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD!;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER!;
const MONGO_DB = "ArbitDB";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=${App_Name}`;
const PORT = process.env.PORT ?? 8013;

export const config = {
  PORT: PORT,
  MONGO_URL: MONGO_URL,
  MONGO_USERNAME: MONGO_USERNAME,
  MONGO_PASSWORD: MONGO_PASSWORD,
  MONGO_DB: MONGO_DB,
};
