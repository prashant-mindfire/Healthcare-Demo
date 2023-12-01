import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Divider,
  FormHelperText,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import API_END_POINTS from "../../shared/ApiEndPoints";
import DotSpinner from "../reusable/dot-spinner/DotSpinner";
import Spinner from "../reusable/spinner/Spinner";
import AppointmentCard from "./AppointmentCard";
import { toast, ToastContainer } from "react-toastify";

const scheduleApppoinmentValidationSchema = yup
  .object({
    department: yup.number().required("Department is required"),
    provider: yup.number().required("Provider is required"),
    appointmentReason: yup.number().required("Appointment reason is required"),
  })
  .required();

const ScheduleAppointment = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(scheduleApppoinmentValidationSchema) });
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState(null);
  const [allProviderList, setAllProviderList] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [provider, setProvider] = useState(null);
  const [openAppointments, setOpenAppointments] = useState([]);

  const [reasonList, setReasonList] = useState([]);
  const [reason, setReason] = useState(null);

  const [scheduleApptInfo, setScheduleApptInfo] = useState({});
  const [patientInfo, setPatientInfo] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [showOpenApptListLoader, setShowOpenApptListLoader] = useState(false);
  const [showAppointmentsBlock, setShowAppointmentsBlock] = useState(false);

  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: "colored",
    });
  };

  const doRefreshOpenAppointment = () => {
    getOpenAppointments();
  };

  useEffect(() => {
    setScheduleApptInfo({
      departmentInfo: department,
      providerInfo: provider,
      reasonInfo: reason,
    });
  }, [department, provider, reason]);

  useEffect(() => {
    const getReasonList = async () => {
      try {
        setShowLoader(true);

        const response = await axios.get(
          API_END_POINTS.getReasons(
            department.departmentid,
            provider.providerid
          )
        );
        setReasonList(response.data.data);
      } catch (error) {
        notify("Failed to get appointment reasons !", "error");
      } finally {
        setShowLoader(false);
      }
    };
    if (department && provider) {
      getReasonList();
    }
  }, [department, provider]);

  const fetchDepartments = async () => {
    try {
      const deptRes = await axios.get(API_END_POINTS.getDepartments());
      if (!deptRes) {
        throw "failed";
      }
      setDepartmentList(deptRes.data.data);
    } catch (error) {
      console.log(error);
      const errorMessage = "Failed to get departments!";
      throw errorMessage;
    }
  };

  const fetchProviders = async () => {
    try {
      const providerRes = await axios.get(API_END_POINTS.getProviders());
      if (!providerRes) {
        throw "failed";
      }

      const providers = providerRes.data.data;
      setAllProviderList(providers);
    } catch (error) {
      const errorMessage = "Failed to get providers!";
      throw errorMessage;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setShowLoader(true);

        await fetchDepartments();
        await fetchProviders();
      } catch (error) {
        notify(error, "error");
      } finally {
        setShowLoader(false);
      }
    };
    init();
  }, []);

  const getProvidersBasedOnDepartment = async (providerIdsList) => {
    try {
      let selectedDepartmentProviders = allProviderList.filter((provider) =>
        providerIdsList.includes(String(provider.providerid))
      );

      setProviderList(selectedDepartmentProviders);
    } catch (error) {
      const errorMessage = "Failed to get providers!";
      throw errorMessage;
    }
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);

    setProvider(null);
    setReason(null);
    if (!value) {
      setProviderList([]);
      setReasonList([]);
    } else {
      getProvidersBasedOnDepartment(value.providerlist);
    }
  };

  const handleProviderChange = (value) => {
    setProvider(value);

    setReason(null);
    if (!value) {
      setReasonList([]);
    }
  };

  useEffect(() => {
    if (reason) {
      getOpenAppointments();
    } else {
      setShowAppointmentsBlock(false);
    }
  }, [reason]);

  const getOpenAppointments = async () => {
    try {
      setShowOpenApptListLoader(true);
      const response = await axios.get(
        API_END_POINTS.getOpenAppointments(
          department.departmentid,
          provider.providerid,
          reason.reasonid
        )
      );
      setOpenAppointments(response.data.data);
      setShowAppointmentsBlock(true);
    } catch (error) {
      notify("Failed to get open appointment !", "error");
    } finally {
      setShowOpenApptListLoader(false);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    const { firstName, lastName, phone, dob } = data;

    const date = new Date(dob);

    // Extract the individual components of the date
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months start from 0, so adding 1 to get the correct month
    const year = date.getFullYear();

    // Format the date in the desired format
    const formattedDate = `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`; // MM/DD/YYYY

    setPatientInfo({
      firstname: firstName,
      lastname: lastName,
      dob: formattedDate,
      mobilephone: phone,
    });

    getOpenAppointments();
  };

  return (
    <>
      <Container disableGutters maxWidth="lg">
        {/* <Grid container spacing={2}> */}
        {/* <Grid item xs={12} md={5}> */}
        <Paper variant="outlined" sx={{ px: 4, py: 3, minHeight: "30vh" }}>
          <CssBaseline />
          <Box
          // sx={{
          //     // marginTop: 8,
          //     display: "flex",
          //     flexDirection: "column",
          //     alignItems: "center",
          // }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "500", color: "gray" }}
              gutterBottom
            >
              Please provide appointment details below
            </Typography>
            <Box sx={{ mt: 4 }}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* <Box component="div" sx={{ my: 3, fontSize: ".9rem" }}>
                  Appointment Information
                </Box> */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Controller
                      control={control}
                      name="department"
                      render={({ field, fieldState }) => (
                        <>
                          <Autocomplete
                            {...field}
                            disablePortal
                            id="department"
                            size="small"
                            options={departmentList}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) =>
                              option.departmentid === value.departmentid
                            }
                            value={department}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Department"
                                required
                                error={!!errors.department}
                              />
                            )}
                            onChange={(event, value) => {
                              field.onChange(value?.departmentid);
                              handleDepartmentChange(value);
                            }}
                          />
                          {fieldState.error ? (
                            <FormHelperText error>
                              {fieldState.error?.message}
                            </FormHelperText>
                          ) : null}
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      control={control}
                      name="provider"
                      render={({ field, fieldState }) => (
                        <>
                          <Autocomplete
                            {...field}
                            disablePortal
                            id="provider"
                            size="small"
                            options={providerList}
                            getOptionLabel={(option) =>
                              `${option.firstname ?? ""} ${
                                option.lastname ?? ""
                              }`
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.providerid === value.providerid
                            }
                            value={provider}
                            disabled={!department}
                            renderOption={(props, option) => {
                              return (
                                <li {...props} key={option.providerid}>
                                  {`${option.firstname ?? ""} ${
                                    option.lastname ?? ""
                                  }`}
                                </li>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Provider"
                                required
                              />
                            )}
                            onChange={(event, value) => {
                              field.onChange(value?.providerid);
                              handleProviderChange(value);
                            }}
                          />
                          {fieldState.error ? (
                            <FormHelperText error>
                              {fieldState.error?.message}
                            </FormHelperText>
                          ) : null}
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      control={control}
                      name="appointmentReason"
                      render={({ field, fieldState }) => (
                        <>
                          <Autocomplete
                            {...field}
                            id="appointmentReason"
                            size="small"
                            isOptionEqualToValue={(option, value) =>
                              option.reasonid === value.reasonid
                            }
                            value={reason}
                            options={reasonList}
                            getOptionLabel={(option) => option.reason}
                            disabled={!department || !provider}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Appointment Reason"
                                required
                              />
                            )}
                            onChange={(event, value) => {
                              field.onChange(value?.reasonid);
                              setReason(value);
                            }}
                          />
                          {fieldState.error ? (
                            <FormHelperText error>
                              {fieldState.error?.message}
                            </FormHelperText>
                          ) : null}
                        </>
                      )}
                    />
                  </Grid>
                  {/* <Grid item xs={12} md={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Check Open Appointment
                    </Button>
                    </Grid> */}
                </Grid>
              </form>
            </Box>
          </Box>
          {showOpenApptListLoader ? (
            <>
              <Divider sx={{ my: 4 }} />
              <DotSpinner />
            </>
          ) : showAppointmentsBlock ? (
            <>
              <Divider sx={{ my: 4 }} />
              {openAppointments.length > 0 ? (
                <Box>
                  <Grid container spacing={2}>
                    {openAppointments.map((appointment, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <AppointmentCard
                          appointment={appointment}
                          scheduleApptInfo={scheduleApptInfo}
                          handleRefreshOpenAppointment={
                            doRefreshOpenAppointment
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Typography variant="subtitle1" sx={{ color: "#2782dd" }}>
                  No open appointment slots available
                </Typography>
              )}
            </>
          ) : (
            ""
          )}
        </Paper>
        {/* </Grid> */}

        {/* <Grid item xs={12} md={7}>
                        <Paper variant="outlined" sx={{ px: 2, py: 1, minHeight: '100%' }}>

                        </Paper>
                    </Grid> */}
        {/* </Grid> */}
      </Container>
      {showLoader ? <Spinner /> : ""}
      <ToastContainer />
    </>
  );
};

export default ScheduleAppointment;
