const mongoose = require('mongoose');


const mongoDB ={
    connect : async()=>{
        // await mongoose.connect('mongodb://127.0.0.1:27017/gxts')
        await mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log('MongoDB connected')
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
          });
    }
}
module.exports = mongoDB