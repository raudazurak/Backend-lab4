const express = require('express')
const app = express()
const db = require('./database')
app.set('view-engine', 'ejs')
const jwt = require("jsonwebtoken")
const cors = require('cors')

require("dotenv").config()
const {init, getUser } = require('./database.js')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

db.init()
app.use(cors({
    origin: "*",
}))
let currentKey = ""
let currentPassword = ""

app.get('/', (req, res) =>{
    res.redirect('/identify')

})

app.post('/identify',async (req, res) =>{

    const username = req.body.userId
    const password = req.body.password
    let userObj = {username:req.body.name}
    let token = jwt.sign(userObj,process.env.ACCESS_TOKEN_SECRET)   
    currentKey = token
    currentPassword = userObj
    res.redirect("/granted")
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
    res.render('start.ejs')

})

app.get('/admin', (req, res) =>{
    res.render('admin.ejs')

})
