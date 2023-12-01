const express = require("express");
const { getDepartments } = require("../controllers/department");

const router = express.Router();

router.get("/", getDepartments);
module.exports = router;
