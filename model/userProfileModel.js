const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
 userId: { 
    type: ObjectId, 
    ref: "Users",
     required: true, 
     unique: true },

    firstName : {
    type :String,
    required : true,
    trim:true},

    lastName : {
        type :String,
        required : true,
        trim:true},
    

 city : {
    type : String, 
    required : true
},

 profileImg : {
    type :String,
    required : true
}
})
module.exports = mongoose.model("Profiles", profileSchema);