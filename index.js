const express=require("express")
const cors=require("cors")
const {connection}=require("./config/db")
const{userRouter}=require("./routes/user.route")
const {authentication}=require("./middleware/authenticate.middlware")
const {Server}=require('socket.io')
const http=require("http")
const {msgModel}=require("./models/message.model")

const app=express()
app.use(cors())
app.use(express.json())
const httpServer=http.createServer(app)
app.use("/user",userRouter)

app.get("/",(req,res)=>{
    res.send("Base API Endpoint")
})

httpServer.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to the db")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`Listning on port ${process.env.port}`)
})

app.use(authentication)

const io=new Server(httpServer)
const users={}

io.on("connection",(socket)=>{
    socket.on("new-user-joined",(name)=>{
        users[socket.id]=name
        socket.broadcast.emit("user-joined",name)
    })
    socket.on("send_message",(message)=>{
        socket.broadcast.emit("receive_message",{
            message,name:users[socket.id]
        })
    })

    socket.on("disconnect",(message)=>{
        socket.broadcast.emit("left_message",users[socket.id])
        delete users[socket.id]
    })
})