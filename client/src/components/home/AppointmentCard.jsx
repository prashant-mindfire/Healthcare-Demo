import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  calcTimeByAddingMin,
  formatDate,
  formatTime,
} from "../../shared/DateFormat";
import CommonDialog from "../reusable/dialog/Dialog";
import Spinner from "../reusable/spinner/Spinner";
import PatientCreation from "./PatientCreation";

export default function AppointmentCard({
  appointment,
  scheduleApptInfo,
  handleRefreshOpenAppointment,
}) {
  const [showLoader, setShowLoader] = useState(false);
  const [showApptSuccesDialog, setShowApptSuccesDialog] = useState(false);
  const [showCreatePatientDialog, setShowCreatePatientDialog] = useState(false);
  const [bookedApptDetails, setBookedApptDetails] = useState(null);
  const [patientInfo, setPatientInfo] = useState({});

  const handleShowApptSuccesDialogClose = (event, reason) => {
    if (reason && ["backdropClick", "escapeKeyDown"].includes(reason)) {
      return;
    }
    setShowApptSuccesDialog(false);
    handleRefreshOpenAppointment();
  };

  const handleShowCreatePatientDialogClose = (event, reason) => {
    if (reason && ["backdropClick", "escapeKeyDown"].includes(reason)) {
      return;
    }
    setShowCreatePatientDialog(false);
  };

  const handleBookedAppointmentInfo = (bookedApptDetails, patientInfo) => {
    setBookedApptDetails(bookedApptDetails);
    setPatientInfo(patientInfo);
  };

  useEffect(() => {
    if (bookedApptDetails) {
      setShowApptSuccesDialog(true);
    }
  }, [bookedApptDetails]);

  return (
    <>
      <Card variant="outlined" sx={{ minWidth: 300 }}>
        <CardHeader
          title={
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: ".9rem", color: "gray" }}>
                  {appointment?.patientappointmenttypename}
                </div>
                <Button
                  onClick={() => setShowCreatePatientDialog(true)}
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                >
                  Book Appointment
                </Button>
              </div>
              {/* <div style={{ display: 'flex', gap: 5 }}>
                                <Rating name="size-small" defaultValue={3.5} precision={0.5} size="small" />
                                <span style={{ fontSize: '.9rem' }}>3.5 (413)</span>
                            </div> */}
            </div>
          }
        />
        <Divider />
        <CardContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              gap: 15,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Book appointment for{" "}
              <span style={{ fontWeight: "600" }}>consultation</span>
            </Typography>
            <Stack
              direction="row"
              spacing={6}
              sx={{
                width: "100%",
                px: 2,
                py: 2,
                background: "#f0f0f5",
                borderRadius: "6px",
                fontSize: ".85rem",
              }}
            >
              <Box
                component="div"
                sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
              >
                <CalendarMonthIcon color="primary" />{" "}
                {appointment.date
                  ? formatDate(appointment.date, "dddd, MMM D")
                  : ""}
              </Box>
              <Box
                component="div"
                sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
              >
                <ScheduleIcon color="primary" />{" "}
                {appointment.starttime
                  ? `${formatTime(
                      appointment.starttime,
                      "hh:mm A"
                    )} - ${calcTimeByAddingMin(
                      appointment.starttime,
                      appointment.duration,
                      "hh:mm A"
                    )}`
                  : ""}
              </Box>
            </Stack>
            <Box>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Duration:{" "}
                {appointment.duration ? `${appointment.duration} min` : ""}
              </Typography>
            </Box>
          </div>
        </CardContent>
        {/* <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                    <ShareIcon />
                    </IconButton>
                
                </CardActions> */}
      </Card>
      <CommonDialog
        open={showApptSuccesDialog}
        onClose={handleShowApptSuccesDialogClose}
        content={
          <Container component="main" maxWidth="md">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CheckCircleIcon fontSize="large" color="success" />
              <Typography component="h3" variant="h5">
                Appointment Confirmed
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Stack spacing={1} sx={{ textAlign: "center" }}>
                  <Typography variant="h6" gutterBottom>
                    Practice Name: athenahealth MDP Sandbox
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: 600, color: "grey" }}
                  >
                    Appointment details
                  </Typography>
                  <Box
                    component="div"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="div"
                      sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                    >
                      <CalendarMonthIcon color="primary" />{" "}
                      {bookedApptDetails?.date
                        ? formatDate(bookedApptDetails?.date, "dddd, MMM D, YYYY")
                        : ""}
                    </Box>
                    <Box
                      component="div"
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <ScheduleIcon color="primary" />{" "}
                      {bookedApptDetails?.starttime
                        ? `${formatTime(
                            bookedApptDetails?.starttime,
                            "hh:mm A"
                          )} - ${calcTimeByAddingMin(
                            bookedApptDetails?.starttime,
                            bookedApptDetails?.duration,
                            "hh:mm A"
                          )}`
                        : ""}
                    </Box>
                  </Box>
                </Stack>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600, color: "grey" }}
                    >
                      Patient information
                    </Typography>
                    <Stack direction="row">
                      <Typography variant="subtitle2">Name:</Typography>&nbsp;
                      {`${patientInfo.firstName ?? ""} ${
                        patientInfo.lastName ?? ""
                      }`}
                    </Stack>
                    <Stack direction="row" sx={{ my: 0.5 }}>
                      <Typography variant="subtitle2">
                        Date of Birth:
                      </Typography>
                      &nbsp;
                      {`${
                        patientInfo.dob
                          ? formatDate(patientInfo.dob, "dddd, MMM D, YYYY")
                          : ""
                      }`}
                    </Stack>
                    <Stack direction="row">
                      <Typography variant="subtitle2">Phone:</Typography>&nbsp;
                      {`${patientInfo.phone ?? ""}`}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600, color: "grey" }}
                    >
                      Provider information
                    </Typography>
                    <Stack direction="row">
                      <Typography variant="subtitle2">Name:</Typography>&nbsp;
                      {`${scheduleApptInfo.providerInfo?.firstname ?? ""} ${
                        scheduleApptInfo.providerInfo?.lastname ?? ""
                      }`}
                    </Stack>
                    <Stack direction="row" sx={{ my: 0.5 }}>
                      <Typography variant="subtitle2">Speciality:</Typography>
                      &nbsp;
                      {`${scheduleApptInfo.providerInfo?.ansinamecode ?? ""}`}
                    </Stack>
                    <Stack direction="row">
                      <Typography variant="subtitle2">Department:</Typography>
                      &nbsp;
                      {`${scheduleApptInfo.departmentInfo?.name ?? ""}`}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        }
        actions={
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={handleShowApptSuccesDialogClose}
              variant="outlined"
              color="error"
              size="small"
            >
              Close
            </Button>
          </Box>
        }
      />
      <CommonDialog
        open={showCreatePatientDialog}
        onClose={handleShowCreatePatientDialogClose}
        content={
          <PatientCreation
            appointmentInfo={appointment}
            bookedAppointmentInfo={handleBookedAppointmentInfo}
            closeDialog={handleShowCreatePatientDialogClose}
          />
        }
      />
      {showLoader ? <Spinner /> : ""}
    </>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.object.isRequired,
  scheduleApptInfo: PropTypes.object.isRequired,
  handleRefreshOpenAppointment: PropTypes.func,
};
