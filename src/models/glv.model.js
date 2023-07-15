const mongoose  = require('mongoose');

const glvSchema = mongoose.Schema({
    name: String,
    description: String,
    birthDay: Date,
    gender: String,
    address: String,
    phone: String,
    holyName: String,
    photoUrl: String,
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }
})

module.exports = mongoose.model('Glv', glvSchema);