const mongoose=require("mongoose")

const msgSchema=mongoose.Schema({
    name:String,
    email:String,
    message:String,
    rec:String
})

const msgModel=mongoose.model("messages",msgSchema)

module.exports={
    msgModel
}