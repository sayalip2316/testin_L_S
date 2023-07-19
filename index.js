const {sequelize, users}=require("./models");
const express=require("express")
const app=express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require("dotenv").config()


app.use(express.json())
app.use(cors())

app.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;
     try {
        bcrypt.hash(password, 5,async(err, hash)=>{
            if(err){
                res.status(500).send("something went wrong")
            }
            if(hash){
                const user=await users.create({name,email,password:hash})
                res.status(200).send({msg:"User Registered Successfully!!"})
            } 
        });
        
     } catch (error) {
        res.status(400).send({error:error})
     }
})


app.post("/login",async(req,res)=>{
    const{email,password}=req.body
    try {
        const user = await users.findOne({ where: { email } });
        if(user){
            bcrypt.compare(password, user.password,async(err, result)=> {
                if(result){
                    res.status(200).send({"msg":"login successfull","token":jwt.sign({"userID":user._id},"masai")})
                }else{
                    res.status(400).send({"msg":"Wrong credentials"})
                }
              
            });
        }
    } catch (error) {
        res.status(400).send({error:error})
    }
})

sequelize.sync().then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("Server is listining")
    })
})

