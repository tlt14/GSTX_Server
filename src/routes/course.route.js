const express = require("express");
const router = express.Router();
const Course = require("../models/course.model");
const { requireAuthentication } = require("../middlewares/auth");
const verifyRoles = require("../middlewares/verifyRole");
const ROLES_LIST = require("../config/roles_list");
router.get("/", async (req, res) => {
  await Course.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
router.get("/:id", async (req, res) => {
  await Course.findById(req.params.id)
    .populate("grades") // Liên kết với collection 'Grade' thông qua trường 'grades'
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    })
});
router.put("/:id", requireAuthentication,verifyRoles(ROLES_LIST.ADMIN),async (req, res) => {
  await Course.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    })
})

router.post("/", requireAuthentication,verifyRoles(ROLES_LIST.ADMIN),async (req, res) => {
  await Course.create(req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    })
})
router.put("/complete/:id", requireAuthentication,verifyRoles(ROLES_LIST.ADMIN),async (req, res) => {
  await Course.findByIdAndUpdate(req.params.id,{status: "completed"})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    })
})

module.exports = router;
