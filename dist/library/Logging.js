"use strict";
// custom loggin library to log all the api calls and verbose messages
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Logging {
}
exports.default = Logging;
_a = Logging;
Logging.log = (args) => _a.info(args);
Logging.info = (args) => {
    return console.log(chalk_1.default.blue(`${new Date().toLocaleString()} [INFO]`), typeof args == 'string' ? chalk_1.default.blueBright(args) : args);
};
Logging.warn = (args) => {
    return console.log(chalk_1.default.yellow(`${new Date().toLocaleString()} [WARNING]`), typeof args == 'string' ? chalk_1.default.yellowBright(args) : args);
};
Logging.error = (args) => {
    return console.log(chalk_1.default.red(`${new Date().toLocaleString()} [ERROR]`), typeof args == 'string' ? chalk_1.default.redBright(args) : args);
};
//# sourceMappingURL=Logging.js.map