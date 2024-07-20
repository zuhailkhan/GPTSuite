"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbconnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const Logging_1 = __importDefault(require("../library/Logging"));
function dbconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.config.MONGO_URL);
            Logging_1.default.log(`Connected to MongoDB at ${config_1.config.MONGO_DB}`);
        }
        catch (error) {
            Logging_1.default.error(`Error connecting to MongoDB: ${error}}`);
        }
    });
}
exports.dbconnect = dbconnect;
//# sourceMappingURL=db.connect.js.map