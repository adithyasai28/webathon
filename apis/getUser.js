const express = require("express")
const userapi = express.Router()
userapi.use(express.json())
const verifyToken = require('../middlewares/verifyToken')
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const expressAsyncHandler = require("express-async-handler")


let userCollection, allVehecleCollection, allStarHotelCollection, allPlaceCollection, allTransportCollection;
userapi.use((req, res) => {
    userCollection = req.app.get("userCollection")
    allVehecleCollection = req.app.get("allVehecleCollection")
    allStarHotelCollection = req.app.get("allStarHotelCollection")
    allPlaceCollection = req.app.get("allPlaceCollection")
    allTransportCollection = req.app.get("allTransportCollection")
    next()
})
userapi.post("/signup", expressAsyncHandler(async (req, res) => {

    let newuser = req.body
    let user = await userCollection.findOne({ username: newuser.username })
    if (!user) {
        let hashedpassword = await bcryptjs.hash(newuser.password, 5)
        newuser.password = hashedpassword
        const dbres = await userCollection.insertOne(newuser)
        res.send({ message: "user created" })
    }
    else
        res.send({ messaage: "username is already taken choose another one ..." })

}));

userapi.post("/signin", expressAsyncHandler(async (req, res) => {

    let loginuser = req.body
    let userDB = await userCollection.findOne({ username: loginuser.username })
    if (userDB) {
        let status = await bcryptjs.compare(loginuser.password, userDB.password)
        if (!status) {
            res.send({ message: "invalid password" })
        }
        else {
            let signedToken = jwt.sign({ username: loginuser.username }, 'abcdef', { expiresIn: "7d" })
            res.send({ message: "login successful", token: signedToken, user: userDB })
        }
    }
    else
        res.send({ message: "username doesnot exist" })
}));

userapi.get("/getTransport", expressAsyncHandler(async (req, res) => {

    let transportUser = req.body
    let transportDB = await allTransportCollection.find({ destination: transportUser.destination, 
                                                          typeOfTransport: transportUser.typeOfTransport, 
                                                          source: transportUser.source })
    res.status(201).send({data : transportDB})                                                 
}))

userapi.get("/getVehicles", expressAsyncHandler(async (req, res) => {

}))

userapi.get("/getHotels", expressAsyncHandler(async (req, res) => {

}))

userapi.get("/getPlaces", expressAsyncHandler(async (req, res) => {

}))


module.exports = userapi