const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
require('dotenv').config()
const mongoose = require("mongoose")

app.use(cors())
app.use(bodyParser.json({ limit: '7mb' }));
app.use(bodyParser.urlencoded({ limit: '7mb', extended: true }));

app.use("/files", express.static('files'))


const http = require("http")

let server = http.createServer(app)
server.listen(process.env.PORT, () => { console.log(`server run on port ${process.env.PORT}`); })

mongoose.connect(process.env.DB, () => { console.log("connected to db"); })



const upload = require("./route/file")
app.use("/upload", upload)


const user = require("./route/user")
app.use("/registion", user)


const summery = require("./route/summery")
app.use("/summery", summery)


const query = require("./route/query")
app.use("/q", query)



const sq = require("./route/sums")
app.use("/sq", sq)



