import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  CssBaseline,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import API_END_POINTS from "../../shared/ApiEndPoints";
import { formatDate } from "../../shared/DateFormat";
import Spinner from "../reusable/spinner/Spinner";
import { toast, ToastContainer } from "react-toastify";

const patientInfoValidationSchema = yup
  .object({
    department: yup.number().required("Department is required"),
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

const CreatePatient = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: null,
      phone: null,
    },
    resolver: yupResolver(patientInfoValidationSchema),
  });

  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const fetchDepartments = async () => {
    try {
      setShowLoader(true);

      const deptRes = await axios.get(API_END_POINTS.getDepartments());
      if (!deptRes) {
        throw "failed";
      }
      setDepartmentList(deptRes.data.data);
    } catch (error) {
      const errorMessage = "Failed to fetch departments";
      notify(errorMessage, "error");
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const onSubmit = async (data) => {
    try {
      setShowLoader(true);
      const {
        department: departmentid,
        firstName: firstname,
        lastName: lastname,
        phone: mobilephone,
        dob,
      } = data;
      const formattedDate = formatDate(dob, "MM/DD/YYYY");

      // Patient created or return, patientid for already created patients
      const patientCreationRes = await axios.post(
        `${API_END_POINTS.createNewPatient()}`,
        { firstname, lastname, dob: formattedDate, departmentid, mobilephone }
      );
      if (!patientCreationRes) {
        throw "PATIENT_CREATION_FAILED";
      }

      resetCreatePatientForm();
      notify("Patient created successfully", "success");
    } catch (error) {
      const errorMessage =
        error === "PATIENT_CREATION_FAILED"
          ? "Patient creation failed"
          : error === "APPOINTMENTBOOK_FAILED"
          ? "Failed to book appointment"
          : "Something went wrong";
      notify(errorMessage, "error");
    } finally {
      setShowLoader(false);
    }
  };

  const resetCreatePatientForm = () => {
    setDepartment(null);
    reset();
  };

  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: "colored",
    });
  };

  return (
    <>
      <Container disableGutters maxWidth="md">
        <Paper variant="outlined" sx={{ px: 4, py: 3 }}>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h6"
              variant="h6"
              sx={{ color: "gray" }}
              gutterBottom
            >
              Create Patient
            </Typography>
            <Box sx={{ mt: 1 }}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                                  margin: "dense",
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
                  <Grid item xs={12} md={4}>
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
                  {/* <Grid item xs={12} md={4}>
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
                        <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={8}>
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
                                margin="dense"
                              />
                            )}
                            onChange={(event, value) => {
                              field.onChange(value?.departmentid);
                              setDepartment(value);
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
                  <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
                    <Button
                      type="submit"
                      variant="outlined"
                      sx={{ mt: 2, mb: 2 }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        </Paper>
      </Container>
      {showLoader ? <Spinner /> : ""}
      <ToastContainer />
    </>
  );
};

export default CreatePatient;
