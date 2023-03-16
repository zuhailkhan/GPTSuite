import { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai'
// @ts-ignore
import { EventSource } from 'launchdarkly-eventsource'
 
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

const streamResponse = async (req: Request, res: Response ) => {
    const url = `https://api.openai.com/v1/chat/completions`
    const messages = [
        {
            "role": "user",
            "content": "Count from 1 to 2"
        }
    ]
    const evs = new EventSource(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            messages,
            model: 'gpt-3.5-turbo',
            stream: true
        })
    })

    evs.addEventListener('message', (event: any) => {
        if(event.data === `[DONE]`) evs.close()
        res.write(`data: ${event.data}\n\n`)
    })

    evs.addEventListener('error', (event: any) => {
        evs.close()
        res.end()
    })

    evs.addEventListener('abort', (event: any) => {
        evs.close()
        res.end();
    });

    evs.addEventListener('close', () => {
        res.end();
    })

    req.on('close', () => {
        evs.close();
    });

    res.on('error', () => {
        evs.close();
    });
}


const listModels = async(req: Request, res: Response) => {
    try {
        const response = await openai.listModels();
        return res.status(200).json(response.data)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// const retrieveModel = async(req: Request, res: Response) => {
//     try {
//         const response = await openai.retrieveModel(req.body.model)

//     }
// }





export default {
    basicResponse,
    streamResponse,
    healthCheck,
    listModels,
}