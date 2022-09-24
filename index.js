const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
require('dotenv').config()
const mongoose = require("mongoose")
const { Server } = require("socket.io");
const http = require('http');
let socket_users = require("./socket_users")
app.use(cors())
app.use(bodyParser.json({ limit: '7mb' }));
app.use(bodyParser.urlencoded({ limit: '7mb', extended: true }));
let server = http.createServer(app)

app.use("/files", express.static('files'))


const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

let users = []

app.set("io", io)

io.on("connection", (client => {

    client.on("join", (data) => {
        const { token } = data
        if (!token) return
        let user = jwt_verify(token)
        const { id } = user
        let prv_users = [...socket_users.getUsers()]
        prv_users = prv_users.filter(e => e.user_id === id)
        prv_users.push({ user_id: id, id: client.id })
        socket_users.setUsers(prv_users)
    })


}))

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


