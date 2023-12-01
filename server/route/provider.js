const express = require("express");
const { getProviders } = require("../controllers/provider");

const router = express.Router();

router.get("/", getProviders);
module.exports = router;
