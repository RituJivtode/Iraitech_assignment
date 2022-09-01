const userModel = require("../model/userModel")
const userProfileModel = require("../model/userProfileModel")
const validator = require("../middleware/validation")
const aws = require("../middleware/aws")
const {uploadFile} = require("../middleware/aws")
const mongoose = require("mongoose")

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const userProfile = async function(req, res) {
    try {

        let body = req.body
        let files = req.files
        if (Object.keys(body).length === 0 && req.files == undefined) {
            return res.status(400).send({ Status: false, message: " Sorry Body can't be empty" })
        }

        if ((files && files.length > 0)) {

            var profilePicUrl = await aws.uploadFile(files[0]);
        }


        const { userId, firstName, lastName, city } = body
        // body.profileImage= profilePicUrl

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, messsage: "plzz enter valid userId" })
        }

        const isUserPresent = await userModel.findOne({ _id: userId})
        if (!isUserPresent) {
            return res.status(404).send({ status: false, messsage: `User not found by this user id ${userId}` })
        }
        const alreadyPresent = await userProfileModel.findOne({ userId: userId})
        if (alreadyPresent) {
            return res.status(400).send({ status: false, messsage: ` ${userId} already present` })
        }


        if (!validator.isValid(firstName)) {
            return res.status(400).send({ status: false, msg: "fullastName is required" })
        }
        if (!validator.isValid(lastName)) {
            return res.status(400).send({ status: false, msg: " Lastname is required" })
        }
        
        if (!validator.isValid(city)) {
            return res.status(400).send({ status: false, msg: "City is required" })
        }

        

        let ProfileData = { userId : userId, firstName: firstName, lastName: lastName, city: city}
        ProfileData.profileImage = profilePicUrl
         const createProfile = await userProfileModel.create(ProfileData)
        return res.status(201).send({ data: createProfile ,  status: "Profile Data Created" })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}

const getList = async function(req,res){
    try{

        const Userlist = await userProfileModel.find()
        if(!Userlist){
            return res.status(404).send({ status: false, message: 'user details not present' });
        }
       return res.status(200).send({status:true, message:"list of users", data:Userlist})
    
}
catch (error) {
    res.status(500).send({ status: false, message: error.message })

}
}


//5====>

const editProfile = async function(req,res){
    try{
         let files = req.files;
         let _id=req.params.userId;
         let body= req.body;
         if (Object.keys(body).length === 0 && req.files.length==0) {
            return res.status(400).send({ Status: false, message: " Sorry Body can't be empty" })
        }
        if (!isValidObjectId(_id)) {
            return res
                .status(400)
                .send({ status: false, message: "Invalid userId" });
        }
        if ((files && files.length > 0)) {

            var profilePicUrl = await aws.uploadFile(files[0]);
        } 
 //const {firstName, lastName, city} = body
//let filterBody={};


let updatedUser = await userProfileModel.findOneAndUpdate({userId:req.params.userId},{$set:{profileImage:profilePicUrl}},{new:true})
if(!updatedUser){
    return res.status(404).send({status:false,message:"User not found"})
}

return res.status(200).send({status:true, message:"User details updated", data:updatedUser})

}
        
catch (error) {
    res.status(500).send({ status: false, message: error.message })

}
}


module.exports = { userProfile, getList, editProfile }