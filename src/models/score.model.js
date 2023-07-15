const mongoose = require('mongoose');
const scoreSchema = mongoose.Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    score:{
        type: Number,
    }
})
module.exports = mongoose.model('Score', scoreSchema);