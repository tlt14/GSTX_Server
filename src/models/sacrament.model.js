const mongoose = require("mongoose");
const Sacrament = mongoose.Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    sacrament:[
        {
            name:String,
            number:String,
            date:String,
            pastor:String,
            sponsor:String,
            parish:String,
            diocese:String,
        }
    ],
    familyId:String,
})
module.exports = mongoose.model("Sacrament", Sacrament);    