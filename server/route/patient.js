const express = require("express");
const { createPatient, getPatient, getPatientDetail } = require("../controllers/patient");

const router = express.Router();

router.post("/", createPatient);
router.get("/", getPatient);
router.get("/:patientId", getPatientDetail)
module.exports = router;
