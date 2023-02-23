const express = require("express");
const router = express.Router();

const { searchDate, registerStudent, registerAdult } = require("../controllers/register.controller");

router.post("/register/student", registerStudent);
router.post("/register/adult", registerAdult)
router.post("/register/searchDate", searchDate)

module.exports = router;
