import express, { Application, Request, Response } from "express";
import bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'

const app: Application = express();

const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/ping', (req: Request, res: Response) => {
    res.send('pong')
})

const PORT = process.env.PORT || 8013

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})
