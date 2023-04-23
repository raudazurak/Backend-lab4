const express = require('express')
const app = express()
const db = require('./database')
app.set('view-engine', 'ejs')
const jwt = require("jsonwebtoken")
const cors = require('cors')

require("dotenv").config()
const {init,getUser,userExists } = require('./database.js')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

db.init()
app.use(cors({
    origin: "*",
}))
let currentKey = ""
let currentPassword = ""
let foundUser

app.get('/', (req, res) =>{
    res.redirect('/IDENTIFY')

})

app.post('/identify',async (req, res) =>{

    const username = req.body.userId
    const password = req.body.password

    if(await userExists(username)){

    foundUser = await getUser(username)
    console.log(foundUser.role)
    

    let userObj = {username:req.body.userId}
    let token = jwt.sign(userObj,process.env.ACCESS_TOKEN_SECRET)   
    currentKey = token
    currentPassword = userObj
    res.redirect("/granted")}
    else{
        console.log("wrong userID or password")
        res.render('fail.ejs')
    }
})


function authenticateToken(req,res,next){ 
    if(currentKey == ""){
        res.redirect("/identify")
    }else if(jwt.verify(currentKey,process.env.ACCESS_TOKEN_SECRET)){
    next()}
    else{
        res.redirect("/identify")
    }
}

app.get('/granted', authenticateToken,(req, res) =>{

    if(foundUser.role == 'student' || foundUser.role == 'teacher' ){
        console.log("success")
        res.render('start.ejs')
    }else if(foundUser.role == 'admin'){
        console.log("successful")
        res.redirect('/ADMIN')
    }
    

})

app.get('/admin', (req, res) =>{
    res.render('admin.ejs')

})

app.get('/IDENTIFY', (req, res) =>{
    res.render('identify.ejs')

})

app.listen(5000)
