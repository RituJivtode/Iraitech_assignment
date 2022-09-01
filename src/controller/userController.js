const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const validator = require("../middleware/validation")

const login = async function(req, res) {
    try {

        let body = req.body

        if (Object.keys(body).length === 0) {
            return res.status(400).send({ Status: false, message: " Sorry Body can't be empty" })
        }

        //****------------------- Email validation -------------------****** //

        if (!validator.isValid(body.email)) {
            return res.status(400).send({ status: false, msg: "Email is required" })
        };

        // For a Valid Email...
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(body.email))) {
            return res.status(400).send({ status: false, message: ' Email should be a valid' })
        };

        //******------------------- password validation -------------------****** //

        if (!validator.isValid(body.password)) {
            return res.status(400).send({ Status: false, message: " password is required" })
        }

        //******------------------- checking User Detail -------------------****** //


        let checkUser = await userModel.findOne({ email: body.email });

        if (!checkUser) {
            return res.status(401).send({ Status: false, message: "email is not correct" });
        }

        let passwordMatch = await bcrypt.compare(body.password, checkUser.password)
        if (!passwordMatch) {
            return res.status(401).send({ status: false, msg: "incorect password" })
        }
        //******------------------- generating token for user -------------------****** //
        let userToken = jwt.sign({

            UserId: checkUser._id,
            batch: "Uranium"

        }, 'FunctionUp Group21', { expiresIn: '86400s' }); // token expiry for 24hrs

        return res.status(200).send({ status: true, message: "User login successfull", data: { userId: checkUser._id, token: userToken } });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



const signup = async function(req, res) {
    try {

        const { email, password } = body
       
        // Email is Mandatory...
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, msg: "Email is required" })
        };
        // For a Valid Email...
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(body.email))) {
            return res.status(400).send({ status: false, message: ' Email should be a valid' })
        };

        // Email is Unique...
        let duplicateEmail = await userModel.findOne({ email: body.email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg: 'Email already exist' })
        };

    

        // //password Number is Mandatory...
        if (!validator.isValid(password)) {
            return res.status(400).send({ Status: false, message: " password is required" })
        }
        // password Number is Valid...
        let Passwordregex = /^[A-Z0-9a-z]{1}[A-Za-z0-9.@#$&]{7,14}$/
        if (!Passwordregex.test(password)) {
            return res.status(401).send({ Status: false, message: " Please enter a valid password, minlength 8, maxxlength 15" })
        }

        let registerBody = { email: email, password: password}
         const register = await userModel.create(registerBody)
        return res.status(201).send({ data: register }, { staus: "User Registered" })
    } catch (err) {
        return res.status(500).send({ status: false, message: error.message })

    }
}




module.exports = { signup, login}