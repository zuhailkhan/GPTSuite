import { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai'
 
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

const healthCheck = async (req: Request, res: Response ) => {
    res.status(200).json({
        status: true,
        message: 'Health Check Successful'
    })
}

const basicResponse = async (req: Request, res: Response ) => {
    
    const messages = req.body.messages;

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,
            stream: true
        })
        console.log(response)
        return res.status(200).json(response.data)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// const streamResponse = async (req: Request, res: Response ) => {
//     const url = `https://api.openai.com/v1/completions`
//     const messages = req.body.messages;

//     try {
//         const response = await openai.createChatCompletion({
//             model: 'gpt-3.5-turbo',
//             messages,
//             stream: true
//         })
//         // @ts-ignore
//         const evs = new EventSource(response.data)
//         evs.addEventListener('message', (event: any) => {
//             res.setHeader('Content-Type', 'text/event-stream');
//             res.setHeader('Cache-Control', 'no-cache');
//             res.setHeader('Connection', 'keep-alive');
//             res.write(event)
//             // @ts-ignore
//             res.flush()
//         })

//         evs.addEventListener('error', (event: any) => {
//             console.log(event)
//         })
        
//     }
//     catch (error) {
//         console.log(error)
//         return res.status(500).json(error)
//     }
// }



export default {
    basicResponse,
    healthCheck
}