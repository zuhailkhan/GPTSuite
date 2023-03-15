import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';
import Logging from '../library/Logging';
const authenticator = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    
    if(!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    try {
        jwt.verify(token as string, process.env.ACCESS_SECRET as string, (err, user) => {
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

                    // if(user) {
                    //    return res.redirect('/refresh')
                    // } 
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