const express = require("express");
const router = express.Router();

const { signin, signup, signout, session } = require("../controllers/auth.controller");

router.post('/auth/signin', signin);
router.post('/auth/signup', signup);
router.post('/auth/signout', signout);
router.get('/auth/session', session);

module.exports = router;