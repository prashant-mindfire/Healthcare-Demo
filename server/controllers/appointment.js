const { default: axios } = require("axios");
const asyncHandler = require("../middleware/asyncHandler");
const { BASE_URL } = require("../utils/constant");

exports.getAppointmentReasons = asyncHandler(async (req, res, next) => {
  const cache = req.cache;
  const token = cache.get("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };
  const { departmentid, providerid } = req.query;
  const response = await axios.get(
    `${BASE_URL}/patientappointmentreasons/newpatient?providerid=${providerid}&departmentid=${departmentid}`,
    { headers }
  );
  res
    .status(200)
    .json({ success: true, data: response.data.patientappointmentreasons });
});

exports.getOpenAppointments = asyncHandler(async (req, res, next) => {
  console.log("req.query", req.query);
  const { providerid, departmentid, reasonid } = req.query;
  const cache = req.cache;
  const token = cache.get("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };
  const url = `${BASE_URL}/appointments/open?providerid=${providerid}&departmentid=${departmentid}&reasonid=${reasonid}`;
  const response = await axios.get(url, { headers });
  res.status(200).json({ success: true, data: response.data.appointments });
});

exports.createNewAppointmentSlot = asyncHandler(async (req, res, next) => {
  const cache = req.cache;
  const token = cache.get("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const {
    departmentid,
    providerid,
    appointmenttypeid,
    appointmentdate,
    appointmenttime,
  } = req.body;
  const response = await axios.post(
    `${BASE_URL}/appointments/open`,
    {
      departmentid,
      providerid,
      appointmenttypeid,
      appointmentdate,
      appointmenttime,
    },
    { headers }
  );
  res.status(200).json({ success: true, data: response.data.appointmentids });
});

exports.bookAppointment = asyncHandler(async (req, res, next) => {
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

exports.getBookedAppointment = asyncHandler(async (req, res, next) => {
  const cache = req.cache;
  const token = cache.get("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };
  const { startdate, enddate, departmentid } = req.query;
  const response = await axios.get(
    `${BASE_URL}/appointments/booked?startdate=${startdate}&enddate=${enddate}&departmentid=${departmentid}`,
    { headers }
  );
  res.status(200).json({ success: true, data: response.data.appointments });
});

exports.getMultipleDeptBookedAppointment = asyncHandler(async (req, res, next) => {
  const cache = req.cache;
  const token = cache.get("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };
  const { startdate, enddate, departmentids } = req.query;
  if (!startdate || !startdate || !departmentids) {
    return res
      .status(400)
      .json({ success: false, error: "Please enter required details" });
  }

  let parsedDeptIds = JSON.parse(departmentids);
  console.log(parsedDeptIds);
  if (parsedDeptIds.length === 0) {
    return res
    .status(400)
    .json({ success: false, error: "Please provide list of department ids" });
  }

  let deptIdsParams = parsedDeptIds.map(id => `&departmentid=${id}`).join('');
  console.log(`${BASE_URL}/appointments/booked/multipledepartment?startdate=${startdate}&enddate=${enddate}${deptIdsParams}`);
  const response = await axios.get(
    `${BASE_URL}/appointments/booked/multipledepartment?startdate=${startdate}&enddate=${enddate}${deptIdsParams}`,
    { headers }
  );
  res.status(200).json({ success: true, data: response.data.appointments });
});

exports.cancelAppointment = asyncHandler(async (req, res, next) => {
  const cache = req.cache;
  const token = cache.get("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const { patientid, cancellationreason, appointmentid } = req.body;
  if (!appointmentid || !patientid || !cancellationreason) {
    return res
      .status(400)
      .json({ success: false, error: "Please enter required details" });
  }

  const response = await axios.put(
    `${BASE_URL}/appointments/${appointmentid}/cancel`,
    {
      patientid,
      cancellationreason,
    },
    { headers }
  );
  res.status(200).json({ success: true, data: response.data });
});

exports.getAppointmentTypes = asyncHandler(async (req, res, next) => {
  const cache = req.cache;
  const token = cache.get("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };

  const { departmentids, providerids } = req.query;

  // if (!(Array.isArray(departmentids))) {
  //   return res
  //     .status(400)
  //     .json({ success: false, error: "Please provide list of department ids" });
  // }

  // if (!(Array.isArray(providerids))) {
  //   return res
  //     .status(400)
  //     .json({ success: false, error: "Please provide list of provider ids" });
  // }
  
  const response = await axios.get(
    `${BASE_URL}/appointmenttypes${departmentids ? `?departmentids=[${departmentids}]` : ''}${providerids ? `&providerids=[${providerids}]` : ''}`,
    { headers }
  );
  res.status(200).json({ success: true, data: response.data.appointmenttypes });
});
