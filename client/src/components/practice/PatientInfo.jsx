import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { green, grey, red } from "@mui/material/colors";
import { useLocation, useNavigate } from "react-router-dom";

const PatientInfo = () => {
  const navigate = useNavigate();
  const {
    state: { patientInfo },
  } = useLocation();

  const gotoPatients = () => {
    navigate("/practice/view-patient");
  };

  return (
    <Container disableGutters maxWidth="lg">
      <CssBaseline />
      <Stack direction="row">
        <Button onClick={gotoPatients} sx={{ textTransform: "capitalize" }}>
          Back
        </Button>
      </Stack>
      <Divider sx={{ mt: 1, mb: 2 }} />
      <Grid container spacing={1}>
        <Grid item xs={12} md={3}>
          <Card variant="outlined" sx={{ px: 3, py: 3, minHeight: "100%" }}>
            <Stack
              spacing={4}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <AccountCircleIcon color="primary" sx={{ fontSize: "5rem" }} />
            </Stack>

            <Stack
              spacing={2}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h6">
                {patientInfo.firstname || ""} {patientInfo.middlename || ""}{" "}
                {patientInfo.lastname || ""}
              </Typography>
            </Stack>
            <Stack
              spacing={2}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                variant="body2"
                sx={{
                  color:
                    patientInfo.status === "active" ? green[400] : red[400],
                }}
              >
                {patientInfo.status || ""}
              </Typography>
            </Stack>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Typography variant="subtitle2" sx={{ color: grey[500] }}>
                      Gender
                    </Typography>
                    <Typography variant="body2">
                      {patientInfo.sex || ""}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Typography variant="subtitle2" sx={{ color: grey[500] }}>
                      Date of Birth
                    </Typography>
                    <Typography variant="body2">
                      {patientInfo.dob || ""}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Typography variant="subtitle2" sx={{ color: grey[500] }}>
                      Phone
                    </Typography>
                    <Typography variant="body2">
                      {patientInfo.homephone || ""}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={2} direction="row">
                    <Typography variant="subtitle2" sx={{ color: grey[500] }}>
                      Email
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ wordWrap: "break-word", width: "80%" }}
                    >
                      {patientInfo.email || ""}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={9}>
          <Card variant="outlined" sx={{ px: 4, py: 3 }}>
            <Stack spacing={4} direction="row">
              <Typography variant="button" sx={{ color: grey[600] }}>
                Patient Information
              </Typography>
            </Stack>
            <Box>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ color: grey[700] }}>
                    Personal Detail
                  </Typography>
                  <Stack direction="row">
                    <Typography variant="subtitle2">First Name:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.firstname}</Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Middle Name:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.middlename ?? "N/A"}</Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Last Name:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.lastname}</Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Last Name:</Typography>
                    <Box sx={{ ml: 1 }}>sdd</Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ color: grey[700] }}>
                    Address
                  </Typography>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Address:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.address1}</Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Country Code:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.countrycode}</Box>
                  </Stack>
                  <Stack direction="row" sx={{ my: 0.5 }}>
                    <Typography variant="subtitle2">State:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.state}</Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">City:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.city}</Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Zip Code:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.zip}</Box>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ color: grey[700] }}>
                    Guarantor Detail
                  </Typography>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Name:</Typography>
                    <Box sx={{ ml: 1 }}>
                      {patientInfo.guarantorfirstname ?? ""}{" "}
                      {patientInfo.guarantorlastname ?? ""}
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Date of Birth:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.guarantordob}</Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Email:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.guarantoremail}</Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Phone:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.guarantorphone}</Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ color: grey[700] }}>
                    Guarantor Address
                  </Typography>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Address:</Typography>
                    <Box sx={{ ml: 1 }}>
                      {patientInfo.guarantoraddress1 ?? ""}
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Country Code:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.countrycode}</Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">State:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.state}</Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">City:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.city}</Box>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="subtitle2">Zip Code:</Typography>
                    <Box sx={{ ml: 1 }}>{patientInfo?.guarantorzip}</Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientInfo;
