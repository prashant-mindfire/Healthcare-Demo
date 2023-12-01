const { default: axios } = require("axios");
const asyncHandler = require("../middleware/asyncHandler");
const { BASE_URL } = require("../utils/constant");

exports.createPatient = asyncHandler(async (req, res, next) => {
  const { firstname, lastname, dob, departmentid, mobilephone } = req.body;
  const id = +departmentid;
  console.log(req.body);
  if (!firstname || !lastname || !dob || !departmentid || !mobilephone) {
    res
      .status(400)
      .json({ success: false, error: "Please enter required fields" });
  }

  const cache = req.cache;
  const token = cache.get("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  try {
    const response = await axios.post(
      `${BASE_URL}/patients`,
      {
        firstname,
        lastname,
        dob,
        departmentid: id,
        mobilephone,
      },
      { headers }
    );
    res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Internal server err" });
  }
});

exports.getPatient = asyncHandler(async (req, res, next) => {
  const cache = req.cache;
  const token = cache.get("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };
  const { offset, limit, departmentid } = req.query;
  if (!departmentid) {
    return res
      .status(400)
      .json({ success: false, error: "Please enter required details" });
  }

  const response = await axios.get(
    `${BASE_URL}/patients?departmentid=${departmentid}${limit ? `&limit=${limit}` : ''}${offset ? `&offset=${offset}` : ''}`,
    { headers }
  );
  res.status(200).json({ success: true, data: response.data.patients });
});

exports.getPatientDetail = asyncHandler(async (req, res, next) => {
  const cache = req.cache;
  const token = cache.get("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const { appointmentid } = req.params;
  const { patientid, reasonid } = req.body;
  if (!appointmentid || !patientid || !reasonid) {
    return res
      .status(400)
      .json({ success: false, error: "Please enter required details" });
  }
  const appointmentId = +appointmentid;
  const reasonId = +reasonid;
  const patientId = +patientid;
  
  const response = await axios.put(
    `${BASE_URL}/appointments/${appointmentid}`,
    {
      patientid,
      reasonid,
    },
    { headers }
  );
  res.status(200).json({ success: true, data: response.data });
});
