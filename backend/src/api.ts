import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express'
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

// protecting routes
app.use("/cashier", jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }));
app.use("/cook", jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }));
app.use("/bartender", jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }));
app.use("/waiter", jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }));

// @ts-ignore
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).send("Invalid Token.");
    } else {
        next(err);
    }
})

// import routes
var auth = require('./routes/auth')
app.use("/", auth)

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
