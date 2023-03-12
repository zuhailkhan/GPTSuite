import express, { Application, Request, Response } from "express";
import bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'
import { dbconnect } from "./config/db.connect";
import Logging from "./library/Logging";
import UserRoute from "./routes/UserRoute";
import authenticator from "./middlewares/authenticator";
import cookieParser from 'cookie-parser'

const app: Application = express();

const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/User', UserRoute)

app.post('/ping', authenticator, (req: Request, res: Response) => {
    res.send('pong')
})

const PORT = process.env.PORT || 8013

const startServer = async ( ) => {
    
    // app.router.use((req, res, next) => {
    //     Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

    //     res.on('finish', () => {
    //         Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]  - Status: [${res.statusCode}]`)
    //     });

    //     next();
    // });

    try {
        await dbconnect();
    } catch (error) {
        console.log(error)
    } finally {
        app.listen(PORT, () => {
            Logging.log(`Server is running on port ${PORT}`)
        })
    }
}

startServer()
