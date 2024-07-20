"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Logging_1 = __importDefault(require("../library/Logging"));
const authenticator = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    try {
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET, (err, user) => {
            if (user) {
                Logging_1.default.info('User Validated');
                next();
            }
            if (err) {
                const { refreshToken } = req.cookies;
                if (!refreshToken) {
                    return res.status(403).json({
                        message: 'Unauthorized'
                    });
                }
                jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
                    if (err) {
                        Logging_1.default.error(err);
                        return res.status(403).json({
                            message: 'Invalid Refresh Token'
                        });
                    }
                    // if(user) {
                    //    return res.redirect('/refresh')
                    // } 
                });
                next();
            }
        });
    }
    catch (err) {
        Logging_1.default.error(err.message);
        next();
    }
};
exports.default = authenticator;
//# sourceMappingURL=authenticator.js.map