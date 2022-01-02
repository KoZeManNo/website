const fs = require("fs")
const os = require("os")
const config = JSON.parse(fs.readFileSync("config.json"))

const WebSocket = require("ws")
const Static = require("node-static")

let server
if (config.ssl) {
    const https = require("https")
    server = https.createServer({
        cert: fs.readFileSync(config.ssl.certificate),
        key: fs.readFileSync(config.ssl.key)
    })
} else {
    const http = require("http")
    server = http.createServer()
}



const format = /^[0-8][a-f0-9]{6}$/
var users = []
var colors = ["000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000"]

var requests = 0
var msgSent = 0
var msgReceived = 0

function getStats() {
    let memoryFree = Math.round(os.freemem() / (1024 * 1024))
    let memoryTotal = Math.round(os.totalmem() / (1024 * 1024))
    let cpuAverage = Math.round(os.loadavg()[0] * 100) + "%"
    return `${users.length},${msgSent} / ${msgReceived},${memoryFree} / ${memoryTotal},${cpuAverage},${requests}`
}

let file = new Static.Server("./static")
server.on("request", (req, res) => {
    req.addListener("end", () => {
        requests++
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
    msgSent++
    socket.send(getStats())
    msgSent++
    
    socket.on("message", data => {
        msgReceived++
        var message = data.toString()

        if (format.test(message)) {
            let index = message.charAt(0)
            let color = message.substring(1)
            if (colors[index] !== color) {
                colors[index] = color
                users.forEach((user) => {
                    user.send(message)
                    msgSent++
                })
            }
        }
    })
    socket.on("close", socket => {
        for (var i = 0; i < users.length; i++) {
            if (users[i].readyState === WebSocket.CLOSING || users[i].readyState === WebSocket.CLOSED) {
                users.splice(i, 1)
            }
        }
    })
})



let host = config.host ? config.host : "localhost"
let port = config.port ? config.port : 8080
server.listen(port, host)



setInterval(() => {
    let stats = getStats()
    users.forEach(user => {
        user.send(stats)
        msgSent++
    })
}, 5000)