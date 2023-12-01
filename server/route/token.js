const express = require("express");
const { getToken } = require("../controllers/token");

const router = express.Router();

router.post("/", getToken);
module.exports = router;
