const Sacrament = require('../models/sacrament.model');
const SacramentController = {
    createSacrament: async (req, res) => {
        const sacrament = await Sacrament.create(req.body);
        res.status(201).json(sacrament);
    },
    updateSacrament: async (req, res) => {
        try{
            const studentId = req.params.studentId;
            const sacrament = await Sacrament.findOneAndUpdate({student: studentId}, req.body, { new: true });
            res.status(200).json(sacrament);
        }catch(err){
            res.status(500).json(err);
        }
        
    },
    getSacramentByStudentId: async (req, res) => {
        try{
            const sacrament = await Sacrament.findOne({ student: req.params.studentId });
            res.status(200).json(sacrament);
        }catch(err){
            res.status(500).json(err);
        }
    }
} 

module.exports = SacramentController