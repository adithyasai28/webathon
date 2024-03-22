const express = require("express")
const app = express()
require("dotenv").config()
const cors = require('cors')
const PORT = process.env.PORT 
const MONGOURL = process.env.MONGOURL

app.use(express.json())
app.use(cors())

const userapi = require("./apis/getUser")

app.use("/user-api",userapi)
// deals with page refresh

const mongoclient = require("mongodb").MongoClient

mongoclient.connect(MONGOURL)
.then((client) => {
    const db = client.db("travelapp")
    const userCollection = db.collection("userCollection")
    const allVehecleCollection = db.collection("allvehecleCollection")
    const allStarHotelCollection = db.collection("allStarHotelCollection")
    const allPlaceCollection = db.collection("allPlaceCollection")
    const allTransportCollection = db.collection("allTransportCollection")
    app.set("usercollection",userCollection)
    app.set("allVehecleCollection",allVehecleCollection)
    app.set("allStarHotelCollection",allStarHotelCollection)
    app.set("allPlaceCollection",allPlaceCollection)
    app.set("allTransportCollection",allTransportCollection)
    console.log("mongo connected")
})
.catch((err) => {
    console.log("Mongo connection error")
})

// expresss error handler
app.use((req,res,err) => {
    res.send({errmessage : err})
})
app.listen(PORT,() => {
    console.log(`server started ${PORT}`)
})