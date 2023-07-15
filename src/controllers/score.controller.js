const Score = require("../models/score.model")

const scoreController = {
    getAll:async function(req,res){
        try{
            const score = await Score.find({})
            res.status(200).json(score)
        }catch(err){
            res.status(500).json(err)
        }
    },
    create:async function(req,res){
        try{
            const score = await Score.create(req.body)
            res.status(200).json(score)
        }catch(err){
            res.status(500).json(err)
        }
    },
}

module.exports = scoreController