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
const Logging_1 = __importDefault(require("../library/Logging"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const reValidate = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        Logging_1.default.error('No Refresh Token Found');
        return res.status(403).json({
            message: 'Unauthorized | No Refresh Token'
        });
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err) {
            Logging_1.default.error('Refresh Token Invalid');
            return res.status(403).json({
                message: 'Unauthorized | Invalid Refresh Token'
            });
        }
        const { username, email, roles } = decoded;
        const newAccessToken = jsonwebtoken_1.default.sign({ username, email, roles }, process.env.ACCESS_SECRET, { expiresIn: '15s' });
        res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 400000 });
        return res.status(201).json({ username, email, roles, jti: Math.floor(Math.random() * 1000000) });
    });
};
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username && !email) {
        return res.status(400).json({
            message: 'Please provide username or email'
        });
    }
    if (!password) {
        return res.status(400).json({
            message: 'Please provide password'
        });
    }
    yield UserModel_1.default.findOne({ $or: [{ username }, { email }] })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            return res.status(401).json({
                message: 'Invalid Credentials'
            });
        }
        else {
            // check password with bcrypt
            bcrypt_1.default.compare(password, user.password, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    Logging_1.default.error(err);
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                if (!result) {
                    Logging_1.default.error('Incorrect Password');
                    return res.status(403).json({
                        message: 'Incorrect Password'
                    });
                }
                if (result) {
                    let { username, email, roles } = user;
                    let usr = {
                        username,
                        email,
                        roles,
                        jti: Math.floor(Math.random() * 1000000)
                    };
                    Logging_1.default.log(`${user.username} logged in`);
                    const refreshToken = jsonwebtoken_1.default.sign(usr, process.env.REFRESH_SECRET);
                    const accessToken = jsonwebtoken_1.default.sign(usr, process.env.ACCESS_SECRET, { expiresIn: '5s' });
                    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 400000 });
                    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
                    return res.status(200).json({
                        status: true,
                        user: usr
                    });
                }
            }));
        }
    }))
        .catch((error) => {
        Logging_1.default.error(error);
        return res.status(500).json({
            message: error.message || 'Internal Server Error'
        });
    });
});
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: "Method not allowed",
        });
    }
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Invalid Request, Please check the fields",
        });
    }
    // find the user in db
    yield UserModel_1.default.countDocuments({ $or: [{ username }, { email }] })
        .then((count) => __awaiter(void 0, void 0, void 0, function* () {
        // if found return error
        if (count) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        // else create a new user
        // hash the password before creating a new user
        bcrypt_1.default.hash(password, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error('error hashing password');
            }
            else {
                const newUser = new UserModel_1.default({
                    password: hash,
                    username,
                    email
                });
                yield newUser.save()
                    .then(() => {
                    Logging_1.default.log('New user created');
                    return res.status(201).json({
                        message: "User created successfully",
                    });
                })
                    .catch((err) => {
                    Logging_1.default.error(err);
                    return res.status(400).json({
                        message: err.message,
                    });
                });
            }
        }));
    }))
        .catch((err) => {
        Logging_1.default.error(err);
        return res.status(500).json({
            message: 'Internal server error',
        });
    });
});
const Logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('accessToken', { httpOnly: true, maxAge: 0 });
    res.clearCookie('refreshToken', { httpOnly: true, maxAge: 0 });
    return res.status(200).json({
        status: true,
        message: 'Logout Successful'
    });
});
const verifyLogin = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    Logging_1.default.warn(accessToken);
    if (!accessToken) {
        return res.status(401).json({
            message: 'Unauthorized | No Access Token'
        });
    }
    jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded) => {
        if (err) {
            Logging_1.default.error(`Access Token Invalid ${err}`);
            return res.status(403).json({
                message: 'Unauthorized | Invalid Access Token'
            });
        }
        if (decoded) {
            return res.status(200).json({
                status: true,
                message: 'User Authorized'
            });
        }
    });
};
exports.default = {
    Login,
    Register,
    reValidate,
    Logout,
    verifyLogin
};
//# sourceMappingURL=UserController.js.map