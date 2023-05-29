import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express'
import { LoginResponse } from './models/responses/login.response.model';
import { genToken, getUser } from './db/auth';
import { environment } from './environment.dev';
import { expressjwt as jwt } from 'express-jwt';

const _ = require('./mongo')
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

app.post('/login', async (req, res) => {
    pino.info(req.body)
    const dummy_res: LoginResponse = {
        success: true,
        role: 2,
        token: genToken("jeffffry"),
    }
    res.send(dummy_res)

    // TODO encrypt password, verify password
    const cur_user = await getUser(req.body.username)
    if (cur_user) {
        const hash_psw = cur_user.password
        const unk_psw = req.body.password // TODO hash
        if (hash_psw === unk_psw) {
            const login_res: LoginResponse = {
                success: true,
                role: cur_user.role,
                token: genToken(req.body.username),
            }

            res.send(login_res)
        }
    }
})

// protecting routes
app.use("/cashier", jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }));
app.use("/cook", jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }));
app.use("/bartender", jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }));
app.use("/waiter", jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }));

// import routes
var cashier = require('./routes/cashier')
app.use('/cashier', cashier)

var cook = require('./routes/cook')
app.use('/cook', cook)

var bartender = require('./routes/bartender')
app.use('/bartender', bartender)

var waiter = require('./routes/waiter')
app.use('/waiter', waiter)


app.listen(port, () => {
    console.log(`API started on port ${port}`)
})
