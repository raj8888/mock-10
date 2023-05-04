const nodemailer=require("nodemailer")
require('dotenv').config()
const {userModel}=require("../models/user.model")

const mailOtpVerify=(user,otp)=>{
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email, 
          pass: process.env.password,
        },
      });
      transporter.sendMail({
        from: process.env.email,
        to: user.email, 
        subject: "OPT Verification", 
        text: "From ChatApp.com",
        html: `<p>Your Verification OPT is ${otp}</p>
        <p>Thank you!!!</p>
        `, 
      }).then((info)=>{
        console.log(info.response)
        console.log("Mail send to user")
      }).catch(err=>{
        console.log(err)
        console.log("Error in sending mail")
      })
}

module.exports={
    mailOtpVerify
}