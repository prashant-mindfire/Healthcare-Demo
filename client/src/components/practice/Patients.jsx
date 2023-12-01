import { yupResolver } from "@hookform/resolvers/yup";
import InfoIcon from "@mui/icons-material/Info";
import {
  Autocomplete,
  Box,
  Chip,
  Container,
  CssBaseline,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import API_END_POINTS from "../../shared/ApiEndPoints";
import Spinner from "../reusable/spinner/Spinner";

const patientListFormValidationSchema = yup
  .object({
    department: yup.number().required("Department is required"),
  })
  .required();

const Patients = () => {
  const navigateTo = useNavigate();
  const {
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(patientListFormValidationSchema) });

  const [departmentList, setDepartmentList] = useState([]);
  const [rows, setRows] = useState([]);
  const [department, setDepartment] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const columns = [
    {
      field: "patientName",
      headerName: "Name",
      valueGetter: (params) => {
        return `${params.row.firstname || ""} ${params.row.middlename || ""} ${
          params.row.lastname || ""
        }`;
      },
    },
    {
      field: "email",
      headerName: "Email",
    },
    { field: "mobilephone", headerName: "Phone" },
    {
      field: "dob",
      headerName: "Date of Birth",
    },
    { field: "sex", headerName: "Gender", width: 60 },
    { field: "address1", headerName: "Address" },
    { field: "state", headerName: "State", width: 60 },
    { field: "city", headerName: "City", width: 90 },
    { field: "zip", headerName: "Zip Code", width: 70 },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params) =>
        params.value ? (
          <Chip
            label={params.value}
            color={
              params.value === "active"
                ? "success"
                : params.value === "inactive"
                ? "secondary"
                : params.value === "deleted"
                ? "error"
                : "primary"
            }
          />
        ) : (
          ""
        ),
      width: 100,
    },
    { field: "registrationdate", headerName: "Registration Date", width: 100 },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => (
        <Tooltip title="See patient information" arrow placement="top">
          <IconButton
            aria-label="Close"
            onClick={() => showPatientInfo(params.row)}
          >
            <InfoIcon color="primary" />
          </IconButton>
        </Tooltip>
      ),
      width: 70,
    },
  ];

  // useEffect(() => {
  //     if (departmentList.length > 0) {
  //         fetchPatients();
  //     }
  // }, [departmentList]);

  useEffect(() => {
    if (department) {
      fetchPatients(department);
    }
  }, [department]);

  useEffect(() => {
    if (departmentList.length > 0) {
      setDepartment(departmentList[0]);
    }
  }, [departmentList]);

  const fetchPatients = async (department) => {
    try {
      setShowLoader(true);

      const { departmentid: departmentId } = department;
      const patientListRes = await axios.get(
        `${API_END_POINTS.patients(departmentId)}`
      );

      let patients = patientListRes.data.data;
      setRows(patients);

      // notify('Appointments fetched successfully', 'success');
    } catch (error) {
      const errorMessage = "Failed to fetch patients";
      notify(errorMessage, "error");
    } finally {
      setShowLoader(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setShowLoader(true);

      const deptRes = await axios.get(API_END_POINTS.getDepartments());
      if (!deptRes) {
        throw "failed";
      }

      // As of now Filter those departments which having more that 1000 patient records, since its throwing error
      let deptList = deptRes.data.data;
      deptList = deptList.filter(
        (dept) => !["1", "21", "142", "150"].includes(dept.departmentid)
      );

      setDepartmentList(deptList);
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

  const showPatientInfo = (row) => {
    // setPatientInfo(row);
    // setShowPatientInfoDialog(true);
    navigateTo("/practice/patient-info", { state: { patientInfo: row } });
  };

  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: "colored",
    });
  };

  return (
    <>
      <Container disableGutters maxWidth="lg">
        <Paper variant="outlined" sx={{ px: 4, py: 3 }}>
          <CssBaseline />
          <Box>
            <Box sx={{ mt: 1 }}>
              <form noValidate>
                <Grid container spacing={3}>
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
                                error={!!errors.department}
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
            getRowId={(row) => row.patientid}
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

      {showLoader ? <Spinner /> : ""}
      <ToastContainer />
    </>
  );
};

export default Patients;
