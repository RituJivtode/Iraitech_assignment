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


        const { firstName, lastName, city } = body
        // body.profileImage= profilePicUrl

        if (!validator.isValid(firstName)) {
            return res.status(400).send({ status: false, msg: "fullastName is required" })
        }
        if (!validator.isValid(lastName)) {
            return res.status(400).send({ status: false, msg: " Lastname is required" })
        }
        
        if (!validator.isValid(city)) {
            return res.status(400).send({ status: false, msg: "City is required" })
        }

        

        let ProfileData = { firstName: firstName, lastName: lastName, city: city}
        ProfileData.profileImage = profilePicUrl
         const createProfile = await userProfileModel.create(ProfileData)
        return res.status(201).send({ data: createProfile }, { staus: "Profile Data Created" })
    } catch (err) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

const getList = async function(req,res){
    try{
        const Userlist = await userProfileModel.find()
        if(!Userlist){
            return res.status(404).send({ status: false, message: 'user details not present' });
        }
       return res.status(200).send({status:true,message:"list of users",data:list})
    
}
catch (error) {
    res.status(500).send({ status: false, message: error.message })

}
}


//5====>

const editProfile = async function(req,res){
    try{
         let files = req.files;
         let _id=req.params.id;
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
const {firstName, lastName, city} = body
let filterBody={};

if ("firstName" in body) {
    if (!isValid(firstName)) {
        return res.status(400).send({ status: false, message: ' firstName Required' });
    }

    filterBody["firstName"] = firstName

}

if ("lastName" in body) {

    if (!isValid(lastName)) {
        return res.status(400).send({ status: false, message: ' lastName Required' });
    }
    filterBody["lastName"] = lastName

}

if ("city" in body) {
    if (!isValid(city)) {
        return res.status(400).send({ status: false, message: ' city Required' });
    }
    
    filterBody["city"] = city

}

filterBody.profileImage=profilePicUrl;


let updatedUser = await userProfileModel.findOne({_id:req.params.id},{$set:filterBody},{new:true})
if(!updatedUser){
    return res.status(404).send({status:false,message:"User not found"})
}
return res.status(200).send({status:true,message:"User details updated", data:updatedUser})

}
        
catch (error) {
    res.status(500).send({ status: false, message: error.message })

}
}





module.exports = { userProfile, getList, editProfile }