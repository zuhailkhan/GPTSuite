"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const App_Name = "arbit-cluster-main";
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
const MONGO_DB = "ArbitDB";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=${App_Name}`;
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8013;
exports.config = {
    PORT: PORT,
    MONGO_URL: MONGO_URL,
    MONGO_USERNAME: MONGO_USERNAME,
    MONGO_PASSWORD: MONGO_PASSWORD,
    MONGO_DB: MONGO_DB,
};
//# sourceMappingURL=config.js.map