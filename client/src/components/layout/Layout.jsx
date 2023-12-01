import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Button, Stack } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import {
  ThemeProvider,
  createTheme,
  styled,
  useTheme,
} from "@mui/material/styles";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import doctorsAppointmentLogo from "../../assets/doctor_appointment_logo.png";
import PracticeContent from "../practice/PracticeContent";
import PersonIcon from "@mui/icons-material/Person";

const drawerWidth = 230;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Layout = ({ openSignInDialog, showDrawer }) => {
  const defaultTheme = createTheme();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [collapseDoctorMenu, setCollapseDoctorMenu] = useState(false);
  const [collapseReportMenu, setCollapseReportMenu] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDoctorMenuClick = () => {
    setCollapseDoctorMenu(!collapseDoctorMenu);
  };

  const handleReportMenuClick = () => {
    setCollapseReportMenu(!collapseReportMenu);
  };

  useEffect(() => {
    if (showDrawer) {
      setOpen(true);
      setCollapseDoctorMenu(true);
    }
  }, [showDrawer]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {showDrawer ? (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                    marginRight: 5,
                    ...(open && { display: "none" }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
              ) : (
                ""
              )}

              <img
                src={doctorsAppointmentLogo}
                alt="no_logo"
                width="65"
                height="65"
              />
              <Typography variant="h6" sx={{ ml: 2 }} noWrap component="div">
                Book appointments
              </Typography>
            </Box>

            {showDrawer ? (
              <Button
                variant="contained"
                onClick={() => navigate("/")}
                color="error"
                size="small"
                startIcon={<LogoutIcon />}
                sx={{ textTransform: "capitalize" }}
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={openSignInDialog}
                variant="contained"
                color="success"
                size="small"
                startIcon={<LoginIcon />}
                sx={{ textTransform: "capitalize" }}
              >
                Practice Login
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {showDrawer ? (
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              {open ? (
                <Box
                  component="div"
                  sx={{
                    py: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{ mb: 1, width: 56, height: 56, bgcolor: blue[500] }}
                  >
                    <PersonIcon sx={{ width: 48, height: 48 }} />
                  </Avatar>
                  <Stack>
                    <Typography variant="subtitle2" sx={{ color: blue[500] }}>
                      Test Practice
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: blue[500] }}>
                      Date: {dayjs().format("MM/DD/YYYY")}
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                ""
              )}

              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List disablePadding dense={true}>
              {["Home"].map((text) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    component={Link}
                    to="/practice"
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <HomeIcon sx={{ color: blue[500] }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {/* ----Doctor Menu ---- */}
            <List disablePadding dense={true}>
              {["Practice"].map((text) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    onClick={handleDoctorMenuClick}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <LocalHospitalIcon sx={{ color: blue[500] }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                    {collapseDoctorMenu ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse
                    in={collapseDoctorMenu}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding dense={true}>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        to="/practice/view-booked-appointment"
                      >
                        <ListItemIcon>
                          <ViewListIcon sx={{ color: blue[500] }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="View Booked Appointment"
                          sx={{ textWrap: "wrap" }}
                        />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        to="/practice/view-patient"
                      >
                        <ListItemIcon>
                          <ViewListIcon sx={{ color: blue[500] }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="View Patient"
                          sx={{ textWrap: "wrap" }}
                        />
                      </ListItemButton>

                      <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        to="/practice/create-appointment"
                      >
                        <ListItemIcon>
                          <EditCalendarIcon sx={{ color: blue[500] }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Create Appointment"
                          sx={{ textWrap: "wrap" }}
                        />
                      </ListItemButton>

                      <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        to="/practice/create-patient"
                      >
                        <ListItemIcon>
                          <PersonAddAlt1Icon sx={{ color: blue[500] }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Create Patient"
                          sx={{ textWrap: "wrap" }}
                        />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        to="/practice/book-appointment"
                      >
                        <ListItemIcon>
                          <ScheduleIcon sx={{ color: blue[500] }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Book Appointment"
                          sx={{ textWrap: "wrap" }}
                        />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </ListItem>
              ))}
            </List>
            {/* <List dense={true}>
            {['Reports'].map((text) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                 onClick={handleReportMenuClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                  {collapseReportMenu ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={collapseReportMenu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense={true}>
                {['Monthly Summary', 'Appointment Detailed'].map((text, index) => (
                   <ListItemButton key={index} sx={{ pl: 4 }} component={Link} to={text === 'Monthly Summary' ? '/doctor/monthly-summary' : '/doctor/appointment-detailed-summary'}>
                    <ListItemIcon>
                      <SummarizeIcon />
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{textWrap: 'wrap'}} />
                  </ListItemButton>
                ))}
                </List>
              </Collapse>
              </ListItem>
            ))}
          </List> */}
          </Drawer>
        ) : (
          ""
        )}

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, backgroundColor: "#f0f0f5" }}
        >
          <Toolbar />
          {showDrawer ? <PracticeContent /> : <Outlet />}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

Layout.propTypes = {
  openSignInDialog: PropTypes.func,
  showDrawer: PropTypes.bool.isRequired,
};

export default Layout;
