import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ScheduleIcon from '@mui/icons-material/Schedule';

const ScheduleAppointmentBtn = () => {
    const navigate = useNavigate();

    return (
        <Button onClick={() => navigate('/schedule-appointment')} color="primary" variant="contained" size="large" startIcon={<ScheduleIcon />} sx={{ textTransform: 'capitalize' }} >
            Book Appointment
        </Button>
    )
}

export default ScheduleAppointmentBtn;