import { Request, Response, NextFunction } from "express";
import Logging from "../library/Logging";
import User from "../models/UserModel";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const reValidate = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        Logging.error('No Refresh Token Found')
        return res.status(403).json({
            message: 'Unauthorized | No Refresh Token'
        })
    }

    jwt.verify(refreshToken as string, process.env.REFRESH_SECRET as string, (err, decoded) => {
        if (err) {
            Logging.error('Refresh Token Invalid')
            return res.status(403).json({
                message: 'Unauthorized | Invalid Refresh Token'
            })
        }
        const { username, email, roles } = decoded as { username: string; email: string; roles: string[] };
        const newAccessToken = jwt.sign({ username, email, roles }, process.env.ACCESS_SECRET as string, { expiresIn: '15s' });
        res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 400000 });
        return res.status(201).json({ username, email, roles, jti: Math.floor(Math.random() * 1000000) });
    })
}

const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    if (!username && !email) {
        return res.status(400).json({
            message: 'Please provide username or email'
        })
    }

    if (!password) {
        return res.status(400).json({
            message: 'Please provide password'
        })
    }

    await User.findOne({ $or: [{ username }, { email }] })
        .then(async (user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid Credentials'
                })
            }

            else {
                // check password with bcrypt
                bcrypt.compare(password, user.password, async (err, result) => {
                    if (err) {
                        Logging.error(err)
                        return res.status(500).json({
                            message: 'Internal Server Error'
                        })
                    }
                    if (!result) {
                        Logging.error('Incorrect Password')
                        return res.status(403).json({
                            message: 'Incorrect Password'
                        })
                    }
                    if (result) {
                        let { username, email, roles } = user
                        let usr = {
                            username,
                            email,
                            roles,
                            jti: Math.floor(Math.random() * 1000000)
                        }
                        Logging.log(`${user.username} logged in`)
                        const refreshToken = jwt.sign(usr, process.env.REFRESH_SECRET as string)
                        const accessToken = jwt.sign(usr, process.env.ACCESS_SECRET as string, { expiresIn: '5s' })
                        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 400000 })
                        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
                        return res.status(200).json({
                            status: true,
                            user: usr
                        })
                    }
                })
            }
        })
        .catch((error) => {
            Logging.error(error)
            return res.status(500).json({
                message: error.message || 'Internal Server Error'
            })
        })

};

const Register = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: "Method not allowed",
        });
    }

    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Invalid Request, Please check the fields",
        })
    }

    // find the user in db

    await User.countDocuments({ $or: [{ username }, { email }] })
        .then(async (count) => {
            // if found return error
            if (count) {
                return res.status(400).json({
                    message: "User already exists",
                })
            }

            // else create a new user
            // hash the password before creating a new user
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    throw new Error('error hashing password')
                }

                else {
                    const newUser = new User({
                        password: hash,
                        username,
                        email
                    })

                    await newUser.save()
                        .then(() => {
                            Logging.log('New user created');
                            return res.status(201).json({
                                message: "User created successfully",
                            })
                        })
                        .catch((err) => {
                            Logging.error(err);
                            return res.status(400).json({
                                message: err.message,
                            })
                        })

                }
            })
        })
        .catch((err) => {
            Logging.error(err);
            return res.status(500).json({
                message: 'Internal server error',
            })
        })
}

const Logout = async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', { httpOnly: true, maxAge: 0 })
    res.clearCookie('refreshToken', { httpOnly: true, maxAge: 0 })
    return res.status(200).json({
        status: true,
        message: 'Logout Successful'
    })
}

const verifyLogin = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    Logging.warn(accessToken)
    if (!accessToken) {
        return res.status(401).json({
            message: 'Unauthorized | No Access Token'
        })
    }

    jwt.verify(accessToken as string, process.env.ACCESS_SECRET as string, (err, decoded) => {
        if (err) {
            Logging.error(`Access Token Invalid ${err}`)
            return res.status(403).json({
                message: 'Unauthorized | Invalid Access Token'
            })
        }

        if(decoded) {
            return res.status(200).json({
                status: true,
                message: 'User Authorized'
            })
        }
    })
}

export default {
    Login,
    Register,
    reValidate,
    Logout, 
    verifyLogin
};