import { yupResolver } from "@hookform/resolvers/yup";
import { FormHelperText, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import API_END_POINTS from "../../shared/ApiEndPoints";
import { formatDate } from "../../shared/DateFormat";
import Spinner from "../reusable/spinner/Spinner";
import { toast, ToastContainer } from 'react-toastify';

const patientInfoValidationSchema = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    dob: yup.date().required("Date of Birth is required"),
    phone: yup
      .string()
      .trim()
      .min(10, "Minimum 10 digits required")
      .max(10, "Maximum 10 digits allowed")
      .required("Phone is required"),
    email: yup.string().trim().email("Please enter valid email"),
    zipCode: yup.string().trim().max(6, "Maximum 6 digits allowed"),
  })
  .required();

const PatientCreation = ({
  appointmentInfo,
  bookedAppointmentInfo,
  closeDialog,
}) => {
  const defaultTheme = createTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    defaultValues: {
      dob: null
    },
    resolver: yupResolver(patientInfoValidationSchema),
  });
  const [showLoader, setShowLoader] = useState(false);

  const onSubmit = async (data) => {
    try {
      setShowLoader(true);
      const { departmentid, appointmentid, reasonid } = appointmentInfo;
      const {
        firstName: firstname,
        lastName: lastname,
        phone: mobilephone,
        dob,
      } = data;
      const formattedDate = formatDate(dob, "MM/DD/YYYY");

      //   Patient created or return, patientid for already created patients
      const patientCreationRes = await axios.post(
        `${API_END_POINTS.createNewPatient()}`,
        { firstname, lastname, dob: formattedDate, departmentid, mobilephone }
      );
      if (!patientCreationRes) {
        throw "PATIENT_CREATION_FAILED";
      }
      let { patientid } = patientCreationRes.data.data[0];

      //Appointment book call
      const appointmentBookRes = await axios.put(
        `${API_END_POINTS.bookAppointment(appointmentid)}`,
        { patientid: Number(patientid), reasonid: Number(reasonid[0]) }
      );
      if (!appointmentBookRes) {
        throw "APPOINTMENTBOOK_FAILED";
      }

      let bookedApptDetails = appointmentBookRes.data.data[0];
      bookedAppointmentInfo(bookedApptDetails, data);
      closeDialog();
    } catch (error) {
      const errorMessage =
        error === "PATIENT_CREATION_FAILED"
          ? "Patient creation failed"
          : error === "APPOINTMENTBOOK_FAILED"
          ? "Failed to book appointment"
          : "Something went wrong";
      notify(errorMessage, 'error');
    } finally {
      setShowLoader(false);
    }
  };

  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: 'colored'
    });
  }

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h6" variant="subtitle1" sx={{color: 'gray'}}>
              Please Provide Patient Information
            </Typography>
            <Box sx={{ mt: 1 }}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <TextField
                      margin="dense"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      size="small"
                      {...register("firstName")}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      margin="dense"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      size="small"
                      {...register("lastName")}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Controller
                      control={control}
                      name="dob"
                      render={({ field, fieldState }) => (
                        <>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              {...field}
                              label="Date of Birth"
                              onChange={(date) => field.onChange(date)}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  required: true,
                                  fullWidth: true,
                                  margin: "dense"
                                },
                              }}
                              error={!!errors.dob}
                            />
                          </LocalizationProvider>
                          {fieldState.error ? (
                            <FormHelperText error>
                              {fieldState.error?.message}
                            </FormHelperText>
                          ) : null}
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      margin="dense"
                      required
                      fullWidth
                      id="phone"
                      label="Phone"
                      name="phone"
                      size="small"
                      {...register("phone")}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  </Grid>
                  {/* <Grid item xs={12} md={3}>
                        <TextField
                            margin="dense"
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            size="small"
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                        </Grid>
                        <Grid item xs={12} md={3}>
                        <TextField
                            margin="dense"
                            fullWidth
                            id="zipCode"
                            label="Zip Code"
                            name="zipCode"
                            size="small"
                            {...register("zipCode")}
                            error={!!errors.zipCode}
                            helperText={errors.zipCode?.message}
                        />
                        </Grid> */}
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sx={{ display: "flex", justifyContent: "center", gap: 2 }}
                  >
                    <Button
                      type="submit"
                      variant="outlined"
                      sx={{ mt: 2, mb: 2 }}
                    >
                      Confirm
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      color="error"
                      sx={{ mt: 2, mb: 2 }}
                      onClick={closeDialog}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      {showLoader ? <Spinner /> : ""}
      <ToastContainer />
    </>
  );
};

PatientCreation.propTypes = {
  appointmentInfo: PropTypes.object.isRequired,
  bookedAppointmentInfo: PropTypes.func,
  closeDialog: PropTypes.func.isRequired,
};

export default PatientCreation;
