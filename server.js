const fs = require("fs")
const config = JSON.parse(fs.readFileSync("config.json"))

const WebSocket = require("ws")
const Static = require("node-static")

let server
if (config.ssl) {
    const https = require("https")
    server = https.createServer({
        cert: config.ssl.certificate,
        key: config.ssl.key
    })
} else {
    const http = require("http")
    server = http.createServer({})
}



const format = /^[0-8][a-f0-9]{6}$/
var users = []
var colors = ["000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000"]

let file = new Static.Server("./static")
server.on("request", (req, res) => {
    req.addListener("end", () => {
        file.serve(req, res)
    }).resume()
})

let wss = new WebSocket.Server({
    server: server,
    path: "/ws"
})
wss.on("connection", (socket) => {
    users.push(socket)
    socket.send(colors.join(""))
    
    socket.on("message", (data) => {
        var message = data.toString()

        if (format.test(message)) {
            let index = message.charAt(0)
            let color = message.substring(1)
            if (colors[index] !== color) {
                colors[index] = color
                users.forEach((user) => {
                    user.send(message)
                })
            }
        }
    })
    socket.on("close", () => {
        users = users.filter(user => user !== this)
    })
})

let host = config.host ? config.host : "localhost"
let port = config.port ? config.port : 8080
server.listen(port, host)