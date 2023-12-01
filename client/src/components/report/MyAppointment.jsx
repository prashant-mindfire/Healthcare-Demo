import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import httpClient from '../../shared/HttpClient';
import API_END_POINTS from '../../shared/ApiEndPoints';
import { Chip, Stack, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

const MyAppointment = () => {
    const columns = [
        { field: 'appointment_date', headerName: 'Appointment Date',  width: 200},
        { field: 'appointment_time', headerName: 'Appointment Time', width: 150  },
        { 
            field: 'appointment_status',
            headerName: 'Appointment Status', 
            renderCell: (params) => (
                <Chip label={params.value} color={params.value === 'Open' ? 'primary' : params.value === 'Closed' ? 'secondary' : 'error' } />
            ),
            width: 150
        },
        {
            field: 'patient_name',
            headerName: 'Patient Name',
            width: 120
           
        },
        {
            field: 'patient_email',
            headerName: 'Patient Email',
            width: 180
        },
        {
            field: 'patient_phone',
            headerName: 'Patient Phone',
            width: 120
        },
        {
            field: 'action',
            headerName: 'Action',
            renderCell: (params) => (
                <Stack direction="row" >
                    <Tooltip title="Close" arrow placement="left">
                        <IconButton aria-label="Close" onClick={() => updateAppointmentStatus(params.id, 'Closed')}>
                            <CloseIcon color="error" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel" arrow placement="right">
                        <IconButton aria-label="Cancel" onClick={() => updateAppointmentStatus(params.id, 'Cancelled')}>
                            <CancelPresentationIcon color="secondary" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
            width: 170
        }
    ];
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const { id: doctorId } = JSON.parse(localStorage.getItem('doctorInfo'));
            let appointmentResponse = await httpClient.get(`${API_END_POINTS.FETCH_DOCTORS_APPOINTMENTS}${doctorId}`);
            if (!appointmentResponse) {
                throw 'failed';
            }

            let { appointments } = appointmentResponse.data.data;
            setRows(appointments);
            alert('Appointments fetched successfully');

        } catch (error) {
            alert('Failed to get appointments');
        }
    }

    const updateAppointmentStatus = async (appointmentId, status) => {
        try {
            let updateAppointmentResponse = await httpClient.patch(
                `${API_END_POINTS.UPDATE_DOCTORS_APPOINTMENT_STATUS}${appointmentId}`,
                {
                    appointment_status: status,
                },
            );
            if (!updateAppointmentResponse) {
                throw 'Failed';
            }

            fetchAppointments();
            alert('Appointment updated successfully');
        } catch (error) {
            alert('Failed to update appointment status');
        }
    }

   
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
                }}
                pageSizeOptions={[5, 10]}
               
            />
        </div>
    )
}

export default MyAppointment;