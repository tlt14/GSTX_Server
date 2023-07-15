const glvModel = require("../models/glv.model")

const glvController ={
    getAll:async function(req,res){
        try{
            const glv = await glvModel.find({}).populate('classId')
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
    },
    create:async function(req,res){
        try{
            const glv = await glvModel.create(req.body)
            res.status(200).json(glv)
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    update:async function(req,res){
        try{
            const glv = await glvModel.findByIdAndUpdate(req.params.id, req.body)
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
    },
    delete:async function(req,res){
        try{
            const glv = await glvModel.findByIdAndDelete(req.params.id)
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
    }
}

module.exports = glvController