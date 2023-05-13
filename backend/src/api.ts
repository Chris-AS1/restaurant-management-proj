import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express'
import { LoginResponse } from './models/responses/login.response.model';
const cors = require('cors');

const pino = require('pino')()

// Loads .env
dotenv.config()
const app = express()
const port = process.env["API_PORT"] || 3000

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send('')
})

app.post('/login', (req, res) => {
    pino.info(req.body)
    const dummy_res: LoginResponse = {
        success: true,
        role: 1
    }
    // TODO encrypt password, verify password
    res.send(dummy_res)
})

app.listen(port, () => {
    console.log(`API started on port ${port}`)
})

// import routes
var cashier = require('./routes/cashier')
app.use('/cashier', cashier)
