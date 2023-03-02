import dotenv from 'dotenv'

dotenv.config()

const MONGO_USERNAME = process.env. MONGO_USERNAME || ''
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ''
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.brymq.mongodb.net/ArbitDB`
const PORT = process.env.PORT || 8013

export const config = {
    PORT: PORT,
    MONGO_URL: MONGO_URL,
    MONGO_USERNAME: MONGO_USERNAME,
    MONGO_PASSWORD: MONGO_PASSWORD
}
