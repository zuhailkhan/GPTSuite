import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';
import Logging from '../library/Logging';
const authenticator = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if(!authorization) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    const token = authorization.split(' ')[1];

    try {
        jwt.verify(token, process.env.ACCESS_SECRET as string, (err, user) => {
            if(user){
                Logging.info('User Validated')
                next()
            }
            if(err) {
                const { refreshToken } = req.cookies;
                if(!refreshToken) {
                    return res.status(403).json({
                        message: 'Unauthorized'
                    })
                }
                jwt.verify(refreshToken as string, process.env.REFRESH_SECRET as string, (err, user) => {
                    if(err) {
                        Logging.error(err)
                        return res.status(403).json({
                            message: 'Invalid Refresh Token'
                        })
                    }

                    if(user) {
                        
                    }
                })
                next()
            }
        })
    }
    catch(err: Error | any) {
        Logging.error(err.message)
        next()
    }
}

export default authenticator