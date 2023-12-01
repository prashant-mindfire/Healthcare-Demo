import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
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
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import API_END_POINTS from "../../shared/ApiEndPoints";
import { formatDate } from "../../shared/DateFormat";
import Spinner from "../reusable/spinner/Spinner";
import { toast, ToastContainer } from "react-toastify";

dayjs.extend(utc);
dayjs.extend(timezone);

const createApppoinmentValidationSchema = yup
  .object({
    department: yup.number().required("Department is required"),
    provider: yup.number().required("Provider is required"),
    appointmentDate: yup.date().required("Appointment date is required"),
    appointmentTime: yup.string().required("Appointment time is required"),
    appointmentType: yup.number().required("Appointment type is required"),
  })
  .required();

function CreateAppointment() {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      appointmentDate: dayjs(),
      appointmentTime: null,
    },
    resolver: yupResolver(createApppoinmentValidationSchema),
  });

  const [departmentList, setDepartmentList] = useState([]);
  const [allProviderList, setAllProviderList] = useState([]);
  const [department, setDepartment] = useState(null);
  const [provider, setProvider] = useState(null);
  const [providerList, setProviderList] = useState([]);
  const [appointmentTypeList, setAppointmentTypeList] = useState([]);
  const [appointmentType, setAppointmentType] = useState(null);

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
    const fetchAppointmentTypes = async () => {
      try {
        setShowLoader(true);

        const appointmentTypesRes = await axios.get(
          API_END_POINTS.getAppointmentTypes(
            department.departmentid,
            provider.providerid
          )
        );
        if (!appointmentTypesRes) {
          throw "failed";
        }

        const appointmentTypes = appointmentTypesRes.data.data;
        setAppointmentTypeList(appointmentTypes);
      } catch (error) {
        const errorMessage = "Failed to get appointment types!";
        notify(errorMessage, "error");
      } finally {
        setShowLoader(false);
      }
    };

    if (department && provider) {
      fetchAppointmentTypes();
    }
  }, [department, provider]);

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
    setAppointmentType(null);
    if (!value) {
      setProviderList([]);
      setAppointmentTypeList([]);
    } else {
      getProvidersBasedOnDepartment(value.providerlist);
    }
  };

  const handleProviderChange = (value) => {
    setProvider(value);

    setAppointmentType(null);
    if (!value) {
      setAppointmentTypeList([]);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log(data);
      setShowLoader(true);

      const {
        department: departmentid,
        provider: providerid,
        appointmentDate,
        appointmentTime: appointmenttime,
        appointmentType: appointmenttypeid,
      } = data;

      const formattedApptDate = formatDate(appointmentDate, "MM/DD/YYYY");

      // Create new appointment slot
      const newApptCreationRes = await axios.post(
        `${API_END_POINTS.createNewAppointmentSlot()}`,
        {
          departmentid,
          providerid,
          appointmentdate: formattedApptDate,
          appointmenttime,
          appointmenttypeid,
        }
      );
      if (!newApptCreationRes) {
        throw "failed";
      }

      notify("Appointment slot created successfully", "success");
      resetCreateAppointmentForm();
    } catch (error) {
      const errorMessage =
        error === "failed"
          ? "Failed to create appointment slot"
          : "Something went wrong";
      notify(errorMessage, "error");
    } finally {
      setShowLoader(false);
    }
  };

  const resetCreateAppointmentForm = () => {
    setDepartment(null);
    setProvider(null);
    setAppointmentType(null);
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
              Create Appointment
            </Typography>
            <Box sx={{ mt: 1 }}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
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
                  <Grid item xs={12} md={6}>
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
                                margin="dense"
                                error={!!errors.provider}
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
                      name="appointmentDate"
                      render={({ field, fieldState }) => (
                        <>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              {...field}
                              label="Date"
                              onChange={(date) => field.onChange(date)}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  required: true,
                                  fullWidth: true,
                                  margin: "dense",
                                },
                              }}
                              error={!!errors.appointmentDate}
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
                    <Controller
                      control={control}
                      name="appointmentTime"
                      render={({ field, fieldState }) => (
                        <>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              {...field}
                              label="Time"
                              onChange={(value) =>
                                field.onChange(dayjs(value).format("HH:mm"))
                              }
                              timezone="America/New_York"
                              slotProps={{
                                textField: {
                                  size: "small",
                                  required: true,
                                  fullWidth: true,
                                  margin: "dense",
                                },
                              }}
                              error={!!errors.appointmentTime}
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
                    <Controller
                      control={control}
                      name="appointmentType"
                      render={({ field, fieldState }) => (
                        <>
                          <Autocomplete
                            {...field}
                            disablePortal
                            id="appointmentType"
                            size="small"
                            options={appointmentTypeList}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) =>
                              option.appointmenttypeid=== value.appointmenttypeid
                            }
                            value={appointmentType}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Appointment Type"
                                required
                                error={!!errors.appointmentType}
                                margin="dense"
                              />
                            )}
                            onChange={(event, value) => {
                              field.onChange(value?.appointmenttypeid);
                              setAppointmentType(value);
                            }}
                            disabled={!department || !provider}
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
}

export default CreateAppointment;
