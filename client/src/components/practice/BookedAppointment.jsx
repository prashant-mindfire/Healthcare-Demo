import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import API_END_POINTS from "../../shared/ApiEndPoints";
import { formatDate } from "../../shared/DateFormat";
import CommonDialog from "../reusable/dialog/Dialog";
import Spinner from "../reusable/spinner/Spinner";
import { toast, ToastContainer } from "react-toastify";
import dayjs from "dayjs";

const bookedApptSearchValidationSchema = yup
  .object({
    startDate: yup.date().required("Start Date is required"),
    endDate: yup.date().required("End Date is required"),
    department: yup.number(),
  })
  .required();

const cancellationReasonValidationSchema = yup
  .object({
    cancellationreason: yup.string().required("Reason is required"),
  })
  .required();

const BookedAppointment = () => {
  const columns = [
    { field: "appointmentid", headerName: "Appointment ID" },
    { field: "appointmenttype", headerName: "Appointment Type", width: 120 },
    {
      field: "scheduleddatetime",
      headerName: "Appointment Date & Time",
      width: 170,
    },
    { field: "scheduledby", headerName: "Scheduled By" },
    {
      field: "patientappointmenttypename",
      headerName: "Patient Appointment Type Name",
      width: 170,
    },
    { field: "lastmodified", headerName: "Last Modified" },
    { field: "lastmodifiedby", headerName: "Last Modified By", width: 108 },
    {
      field: "appointmentstatus",
      headerName: "Status",
      renderCell: (params) =>
        params.value ? (
          <Chip
            label={
              params.value === "o"
                ? "Open"
                : params.value === "f"
                ? "Booked"
                : params.value === "x"
                ? "Cancelled"
                : ""
            }
            color={
              params.value === "o"
                ? "primary"
                : params.value === "f"
                ? "success"
                : params.value === "x"
                ? "error"
                : "primary"
            }
          />
        ) : (
          ""
        ),
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Cancel Appointment" arrow placement="top">
            <IconButton
              aria-label="Close"
              onClick={() => showCancelReasonDialog(params.row)}
            >
              <CloseIcon color="error" />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Cancel" arrow placement="right">
            <IconButton
              aria-label="Cancel"
              onClick={() => updateAppointmentStatus(params.id, "Cancelled")}
            >
              <CancelPresentationIcon color="secondary" />
            </IconButton>
          </Tooltip> */}
        </Stack>
      ),
    },
  ];

  const {
    control: searchFormControl,
    handleSubmit: searchFormHandleSubmit,
    formState: { errors: searchFormErrors },
  } = useForm({ resolver: yupResolver(bookedApptSearchValidationSchema) });
  const {
    formState: { errors: reasonFormErrors },
    trigger: reasonFormTrigger,
    getValues: reasonFormGetValues,
    register: reasonFormRegister,
    reset: reasonFormReset,
  } = useForm({ resolver: yupResolver(cancellationReasonValidationSchema) });

  const [formSearchData, setFormSearchData] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [rows, setRows] = useState([]);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [cancellingRow, setCancellingRow] = useState({});
  const [selectedStartDate, setSelectedStartDate] = useState(
    dayjs().startOf("week")
  );
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs().endOf("week"));
  const [department, setDepartment] = useState(null);
  const [deptIds, setDeptIds] = useState([]);

  const [showLoader, setShowLoader] = useState(false);

  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: "colored",
    });
  };

  useEffect(() => {
    if (departmentList.length > 0) {
      const deptIds = departmentList.map((dept) => dept.departmentid);
      fetchAppointments(deptIds);
    }
  }, [departmentList]);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate && departmentList.length > 0) {
      const deptIds = department
        ? [department.departmentid]
        : departmentList.map((dept) => dept.departmentid);
      fetchAppointments(deptIds);
    }
  }, [selectedStartDate, selectedEndDate, department]);

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

  const fetchAppointments = async (departmentIds) => {
    try {
      setShowLoader(true);

      // let { startDate, endDate, department } = data;
      let formattedStartDate = formatDate(selectedStartDate, "MM/DD/YYYY");
      let formattedEndDate = formatDate(selectedEndDate, "MM/DD/YYYY");
      setDeptIds(departmentIds);
      let strigifyDepartmentIds = JSON.stringify(departmentIds);

      const bookedAppointmentRes = await axios.get(
        `${API_END_POINTS.bookedAppointmentMultipleDept(
          formattedStartDate,
          formattedEndDate,
          strigifyDepartmentIds
        )}`
      );

      let bookedAppointments = bookedAppointmentRes.data.data;
      if (bookedAppointments.length > 0) {
        bookedAppointments = bookedAppointments
          .filter((appointment) => appointment.appointmentstatus === "f")
          .reverse();
      }
      setRows(bookedAppointments);

      // notify('Appointments fetched successfully', 'success');
    } catch (error) {
      const errorMessage = "Failed to fetch appointments";
      notify(errorMessage, "error");
    } finally {
      setShowLoader(false);
    }
  };

  const onSubmit = (data) => {
    setFormSearchData(data);
  };

  useEffect(() => {
    if (formSearchData) {
      fetchAppointments(formSearchData);
    }
  }, [formSearchData]);

  const showCancelReasonDialog = (row) => {
    setCancellingRow(row);
    setShowReasonDialog(true);
  };

  const updateAppointmentStatus = async () => {
    try {
      let isReasonFormValid = await reasonFormTrigger();
      if (!isReasonFormValid) {
        return;
      }

      setShowLoader(true);
      const { appointmentid, patientid } = cancellingRow;
      const cancellationreason = reasonFormGetValues("cancellationreason");

      await axios.put(`${API_END_POINTS.cancelAppointment()}`, {
        patientid: Number(patientid),
        appointmentid: Number(appointmentid),
        cancellationreason,
      });

      reasonFormReset();
      setShowReasonDialog(false);
      fetchAppointments(deptIds);
      notify("Appointment updated successfully", "success");
    } catch (error) {
      const errorMessage = "Failed to update appointment";
      notify(errorMessage, "error");
    } finally {
      setShowLoader(false);
    }
  };

  const handleReasonDialogClose = (event, reason) => {
    if (reason && ["backdropClick", "escapeKeyDown"].includes(reason)) {
      return;
    }
    setShowReasonDialog(false);
  };

  return (
    <>
      <Container disableGutters maxWidth="lg">
        <Paper variant="outlined" sx={{ px: 4, py: 3 }}>
          <CssBaseline />
          <Box>
            <Box sx={{ mt: 1 }}>
              <form onSubmit={searchFormHandleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Controller
                      control={searchFormControl}
                      name="startDate"
                      render={({ field, fieldState }) => (
                        <>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              {...field}
                              label="Start Date"
                              onChange={(date) => {
                                field.onChange(date);
                                setSelectedStartDate(date);
                              }}
                              selected={field.value}
                              value={selectedStartDate}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  required: true,
                                  fullWidth: true,
                                },
                              }}
                              error={!!searchFormErrors.startDate}
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
                  <Grid item xs={12} md={3}>
                    <Controller
                      control={searchFormControl}
                      name="endDate"
                      render={({ field, fieldState }) => (
                        <>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              {...field}
                              label="End Date"
                              onChange={(date) => {
                                field.onChange(date);
                                setSelectedEndDate(date);
                              }}
                              selected={field.value}
                              value={selectedEndDate}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  required: true,
                                  fullWidth: true,
                                },
                              }}
                              error={!!searchFormErrors.endDate}
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
                  <Grid item xs={12} md={6}>
                    <Controller
                      control={searchFormControl}
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
                              option.id === value.id
                            }
                            value={department}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Department"
                                error={!!searchFormErrors.department}
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
                  {/* <Grid item xs={12} md={2}>
                    <Button type="submit" variant="contained">
                      Search
                    </Button>
                  </Grid> */}
                </Grid>
              </form>
            </Box>
          </Box>
        </Paper>
        <Box sx={{ height: 445, width: "100%" }}>
          <DataGrid
            rows={rows}
            getRowId={(row) => row.appointmentid}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </Box>
      </Container>

      <CommonDialog
        open={showReasonDialog}
        onClose={handleReasonDialogClose}
        content={
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h6" variant="subtitle1">
                Please provide reason for cancel
              </Typography>
              <Box sx={{ mt: 1 }}>
                <form noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <TextField
                        margin="dense"
                        required
                        fullWidth
                        label="Reason"
                        name="cancellationreason"
                        rows={4}
                        {...reasonFormRegister("cancellationreason")}
                        error={!!reasonFormErrors.cancellationreason}
                        helperText={
                          reasonFormErrors.cancellationreason?.message
                        }
                        autoFocus
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sx={{ display: "flex", justifyContent: "center", gap: 2 }}
                    >
                      <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        sx={{ mt: 2, mb: 2 }}
                        onClick={updateAppointmentStatus}
                      >
                        Submit
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        color="error"
                        sx={{ mt: 2, mb: 2 }}
                        onClick={() => {
                          reasonFormReset();
                          setShowReasonDialog(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Box>
          </Container>
        }
      />
      {showLoader ? <Spinner /> : ""}
      <ToastContainer />
    </>
  );
};

export default BookedAppointment;
