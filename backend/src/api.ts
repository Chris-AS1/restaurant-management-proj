import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express'

// Loads .env
dotenv.config()
const app = express()
const port = process.env["API_PORT"] || 3000

app.get('/', (req, res) => {
    res.send('')
})

app.listen(port, () => {
    console.log(`API started on port ${port}`)
})

// import routes
var cashier = require('./routes/cashier')
app.use('/cashier', cashier)