const express = require("express");
const {
  getAppointmentReasons,
  getOpenAppointments,
  createNewAppointmentSlot,
  bookAppointment,
  getBookedAppointment,
  getMultipleDeptBookedAppointment,
  cancelAppointment,
  getAppointmentTypes
} = require("../controllers/appointment");

const router = express.Router();

router.get("/reasons", getAppointmentReasons);
router.get("/open", getOpenAppointments);
router.post("/open", createNewAppointmentSlot);
router.put("/book/:appointmentid", bookAppointment);
router.get("/booked", getBookedAppointment);
router.get("/multipledeptbooked", getMultipleDeptBookedAppointment);
router.put("/cancel", cancelAppointment);
router.get("/appointmenttypes", getAppointmentTypes);
module.exports = router;
