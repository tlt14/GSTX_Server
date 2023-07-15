const mongoose  = require('mongoose');

const classSchema = mongoose.Schema({
    name: String,
    description: String,
    countStudent: Number,
    glv:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Glv'
    },
    grade:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grade'
    }
})

module.exports = mongoose.model('Class', classSchema);