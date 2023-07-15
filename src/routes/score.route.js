const express = require("express");
const scoreController = require("../controllers/score.controller");
const router = express.Router();

router.get("/", scoreController.getAll);
router.post("/", scoreController.create);



module.exports = router