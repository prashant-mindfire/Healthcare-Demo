import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { Divider } from "@mui/material";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import httpClient from "../../shared/HttpClient";
import API_END_POINTS from "../../shared/ApiEndPoints";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const appointmentBookValidationSchema = yup
  .object({
    appointmentDate: yup.date().required("Appointment date is required"),
    timeSlot: yup.string().trim().required("Time slot is required"),
    patientName: yup.string().trim().required("Patient name is required"),
    patientEmail: yup
      .string()
      .trim()
      .email("Please enter valid email")
      .required("Patient email is required"),
    patientPhone: yup.string().trim().required("Patient phone is required"),
  })
  .required();

const BookAppointment = ({ doctor, closeDialog }) => {
  const defaultTheme = createTheme();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(appointmentBookValidationSchema),
  });

  const [currTimeSlot, setCurrTimeSlot] = useState("");

  const onSubmit = async (data) => {
    let {
      appointmentDate: appointment_date,
      patientEmail: patient_email,
      patientName: patient_name,
      patientPhone: patient_phone,
      timeSlot: appointment_time,
    } = data;
    let { id: doctor_id } = doctor;
    try {
      const appointmentBookResponse = await httpClient.post(
        `${API_END_POINTS.BOOK_APPOINTMENT}`,
        {
          doctor_id,
          appointment_date,
          appointment_time,
          patient_name,
          patient_email,
          patient_phone,
          appointment_status: "Open",
        }
      );
      if (!appointmentBookResponse) {
        throw "error";
      }
      alert(appointmentBookResponse.data.message);
      closeDialog();
    } catch (error) {
      alert("Failed to get doctors list");
    }
  };

  const handleTimeSlotChange = (event) => {
    console.log(event.target.value);
    setCurrTimeSlot(event.target.value);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            // marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            component="div"
            variant="subtitle1"
            sx={{ fontWeight: "600", color: "gray" }}
          >
            Please provide your appointment details below
          </Typography>
          <Box sx={{ mt: 1 }}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Box component="div" sx={{ mt: 2, fontSize: ".9rem" }}>
                Appointment Information
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    control={control}
                    name="appointmentDate"
                    render={({ field, fieldState }) => (
                      <>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            {...field}
                            label="Appointment Date*"
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            sx={{ mt: 1 }}
                            slotProps={{ textField: { size: "small" } }}
                            error={!!fieldState.error}
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
                <Grid item xs={6}>
                  <FormControl
                    sx={{ m: 1, minWidth: "100%" }}
                    size="small"
                    error={!!errors.timeSlot}
                    {...register("timeSlot")}
                  >
                    <InputLabel id="demo-select-small-label">
                      Time Slot*
                    </InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      name="timeSlot"
                      value={currTimeSlot}
                      label="Time Slot"
                      onChange={handleTimeSlotChange}
                    >
                      {doctor.appointment_slot_time.map((timeSlot, index) => (
                        <MenuItem value={timeSlot} key={index}>
                          {timeSlot}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.timeSlot?.message}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Box component="div" sx={{ mt: 2, fontSize: ".9rem" }}>
                Patient Information
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="patientName"
                    label="Name"
                    name="patientName"
                    size="small"
                    {...register("patientName")}
                    error={!!errors.patientName}
                    helperText={errors.patientName?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="patientPhone"
                    label="Phone"
                    name="patientPhone"
                    size="small"
                    {...register("patientPhone")}
                    error={!!errors.patientPhone}
                    helperText={errors.patientPhone?.message}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="patientEmail"
                    label="Email"
                    name="patientEmail"
                    size="small"
                    {...register("patientEmail")}
                    error={!!errors.patientEmail}
                    helperText={errors.patientEmail?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Book
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

BookAppointment.propTypes = {
  doctor: PropTypes.object,
  closeDialog: PropTypes.func.isRequired,
};

export default BookAppointment;
