// const ATHENA_API_PRACTICE_ID = `195900`;
// export const GRANT_TYPE = 'client_credentials';
// export const SCOPE =  'athena/service/Athenanet.MDP.*';
// export const CLIENT_ID = '0oajnfj1s4o3tr5eW297';
// export const CLIENT_SECRET = 'ioZo6y4khlxH55j594CFm_PWtCgcbaswJ6QlaU7L';
const BASE_URL = `http://localhost:3000/api/v1/`;

const API_END_POINTS = {
  //Login
  LOGIN: `user/login`,

  //Doctors
  INIT_DOCTORS: `doctor/init`,
  FETCH_DOCTORS: `doctor`,

  //Appointments
  BOOK_APPOINTMENT: `appointment/book`,
  UPDATE_DOCTORS_APPOINTMENT_STATUS: `appointment/`,
  FETCH_DOCTORS_APPOINTMENTS: `appointment/`,

  //Reports
  MONTHLY_SUMMARY_REPORT: `appointment/report/summary`,
  APPOINTMENT_DETAILED_REPORT: `appointment/report/detailed`,

  // ************************************************************

  // Access Token
  getAccessToken: () => `http://localhost:5000/api/v1/token`,

  // Departments
  getDepartments: () => `${BASE_URL}department`,

  // Providers
  getProviders: () => `${BASE_URL}provider`,

  // Reasons
  getReasons: (departmentId, providerId) =>
    `${BASE_URL}appointment/reasons?providerid=${providerId}&departmentid=${departmentId}`,

  // Appointment
  getOpenAppointments: (departmentId, providerId, reasonId) =>
  `${BASE_URL}appointment/open?providerid=${providerId}&departmentid=${departmentId}&reasonid=${reasonId}`,

  bookAppointment: (appointmentId) => `${BASE_URL}appointment/book/${appointmentId}`,
  bookedAppointment: (startDate, endDate, departmentId) => `${BASE_URL}appointment/booked?startdate=${startDate}&enddate=${endDate}&departmentid=${departmentId}`,
  bookedAppointmentMultipleDept: (startDate, endDate, departmentIds) => `${BASE_URL}appointment/multipledeptbooked?startdate=${startDate}&enddate=${endDate}&departmentids=${departmentIds}`,
  cancelAppointment: () => `${BASE_URL}appointment/cancel`,
  getAppointmentTypes: (departmentids, providerids) => `${BASE_URL}appointment/appointmenttypes${departmentids ? `?departmentids=${departmentids}` : ''}${providerids ? `&providerids=${providerids}` : ''}`,
  createNewAppointmentSlot: () => `${BASE_URL}appointment/open`,

  // Patient
  createNewPatient: () => `${BASE_URL}patient`,
  patients: (departmentId, limit, offset) => `${BASE_URL}patient?departmentid=${departmentId}${limit ? `&limit=${limit}` : ''}${offset ? `&offset=${offset}` : ''}`,
  specificPatientInfo: (patientId) => `${BASE_URL}patient/${patientId}`
};

export default API_END_POINTS;
