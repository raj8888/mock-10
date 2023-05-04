const express=require("express")
const {userModel}=require("../models/user.model")
const {mailOtpVerify}=require("../config/mailer")
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")

const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    try {
        let data=req.body
        let email=data.email
        let findEmail=await userModel.findOne({email})
        if(findEmail){
            res.status(401).send({"Message":"User Already Register"})
        }else{
            bcrypt.hash(data.password,5,async(err,hash)=>{
                if(err){
                    console.log(err)
                    res.status(201).send({"Message":"Please try again"})
                }else{
                    // if(findEmail.otp==data.otp){
                        data.password=hash
                        const user=new userModel(data)
                        await user.save()
                        res.status(201).send({"Message":"User Register Successfully"})
                    // }else{
                    //     res.status(201).send({"Message":"Enter Valid OTP"})
                    // }
                }
            })
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

userRouter.post("/register/verification/otp",async(req,res)=>{
    try {
        let {email,password}=req.body
        let user=req.body
        let otp=otpGenerator.generate(6, { upperCaseAlphabets: true, specialChars: true });
        let findEmail=await userModel.findOne({email})
        if(findEmail){
            res.status(401).send({"Message":"User Already Register"})
        }else{
            mailOtpVerify(user,otp)
            res.status(201).send({"Message":"OTP send to you email"})
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})


userRouter.post("/login",async(req,res)=>{
    try {
        let {email,password}=req.body
        let user=req.body
        let findEmail=await userModel.findOne({email})

        if(findEmail){
            bcrypt.compare(password,findEmail.password,async(err,result)=>{
                if(err){
                    console.log(err.message)
                    res.status(401).send({"Message":"Enter valid Credentials"})
                }else if(result){
                    let token=jwt.sign({userID:findEmail._id},process.env.seckey)
                    res.status(201).send({"Message":"User Login Successfull","token":token})
                }else{
                    res.status(401).send({"Message":"Enter valid Credentials"})
                }
            })
            
        }else{
            res.status(201).send({"Message":"Please login again"})
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

module.exports={
    userRouter
}
