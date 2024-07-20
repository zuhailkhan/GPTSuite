"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const UserRoute = express_1.default.Router();
UserRoute.post('/login', UserController_1.default.Login);
UserRoute.post('/register', UserController_1.default.Register);
UserRoute.get('/refresh', UserController_1.default.reValidate);
UserRoute.get('/logout', UserController_1.default.Logout);
UserRoute.get('/verify', UserController_1.default.verifyLogin);
exports.default = UserRoute;
//# sourceMappingURL=UserRoute.js.map