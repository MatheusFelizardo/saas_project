const bodyParser = require("body-parser")
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

require('./app/controllers/index')(app)

app.listen(5000)