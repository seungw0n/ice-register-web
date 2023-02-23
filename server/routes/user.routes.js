const express = require("express");
const router = express.Router();

const { getRegisterHistory } = require("../controllers/user.controller");

router.get("/user/getRegisterHistory", getRegisterHistory);
// router.post("/user/registerStudent", registerStudent);
// router.post("/user/registerAdult", registerAdult)

module.exports = router;
