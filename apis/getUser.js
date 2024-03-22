const express = require("express")
const userapi = express.Router()

userapi.use(express.json())

const verifyToken = require('../middlewares/verifyToken')
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const expressAsyncHandler = require("express-async-handler")


// let userCollection, allVehecleCollection, allStarHotelCollection, allPlaceCollection, allTransportCollection;
// userapi.use((req, res) => {
//     userCollection = req.app.get("userCollection")
//     allVehecleCollection = req.app.get("allVehecleCollection")
//     allStarHotelCollection = req.app.get("allStarHotelCollection")
//     allPlaceCollection = req.app.get("allPlaceCollection")
//     allTransportCollection = req.app.get("allTransportCollection")
//     next()
// })
userapi.post("/signup", expressAsyncHandler(async (req, res) => {

    let userCollection = req.app.get("userCollection")
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

    let userCollection = req.app.get("userCollection")
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
    let allTransportCollection = req.app.get("allTransportCollectio")
    let transportUser = req.body
    let transportDB = await allTransportCollection.find({ destination: transportUser.destination, 
                                                          typeOfTransport: transportUser.typeOfTransport, 
                                                          source: transportUser.source })
    res.status(201).send({data : transportDB})                                                 
}))

userapi.get("/getVehicles", expressAsyncHandler(async (req, res) => {
    let allVehecleCollection = req.app.get("allVehecleCollection")
    let vehecleUser = req.body
    let vehecleDB = await allVehecleCollection.find({ destination : vehecleDB.destination,
                                                      vehecleType : vehecleDB.vehecleType }).toArray();
    res.status(201).send({data : vehecleDB})                                                 
}))

userapi.get("/getHotels", expressAsyncHandler(async (req, res) => {
    let allHotelCollection = req.app.get("allHotelCollection")
    let hotelUser = req.body
    let hotelDB = await allHotelCollection.find({ destination : hotelDB.destination,
                                                  starRating : hotelDB.starRating}).toArray();
    res.status(201).send({data : hotelDB})                                                 

}))

userapi.get("/getPlaces", expressAsyncHandler(async (req, res) => {
    let allPlaceCollection = req.app.get("allPlaceCollection")
    let placeUser = req.body
    let placeDB = await allPlaceCollection.find({ destination : placeDB.destination}).toArray();
    res.status(201).send({data : placeDB}) 
}))


module.exports = userapi