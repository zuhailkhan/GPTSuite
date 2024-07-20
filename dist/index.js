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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_connect_1 = require("./config/db.connect");
const Logging_1 = __importDefault(require("./library/Logging"));
const UserRoute_1 = __importDefault(require("./routes/UserRoute"));
const ChatRoute_1 = __importDefault(require("./routes/ChatRoute"));
const authenticator_1 = __importDefault(require("./middlewares/authenticator"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: ['http://localhost:8014'],
    methods: 'GET,POST',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/User', UserRoute_1.default);
app.use('/Chat', ChatRoute_1.default);
app.post('/ping', authenticator_1.default, (req, res) => {
    res.send('pong');
});
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8013;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // app.router.use((req, res, next) => {
    //     Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`)
    //     res.on('finish', () => {
    //         Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]  - Status: [${res.statusCode}]`)
    //     });
    //     next();
    // });
    try {
        yield (0, db_connect_1.dbconnect)();
    }
    catch (error) {
        console.log(error);
    }
    finally {
        app.listen(PORT, () => {
            Logging_1.default.log(`Server is running on port ${PORT}`);
        });
    }
});
startServer();
//# sourceMappingURL=index.js.map