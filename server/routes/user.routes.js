const express = require("express");
const router = express.Router();

const { getRegisterHistory, deleteRegister } = require("../controllers/user.controller");

router.get("/user/getRegisterHistory", getRegisterHistory);
router.post("/user/deleteRegister", deleteRegister);
// router.post("/user/registerStudent", registerStudent);
// router.post("/user/registerAdult", registerAdult)

module.exports = router;
