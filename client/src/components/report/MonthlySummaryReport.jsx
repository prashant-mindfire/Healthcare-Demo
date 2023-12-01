import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import httpClient from '../../shared/HttpClient';
import API_END_POINTS from '../../shared/ApiEndPoints';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';

const MonthlySummaryReport = () => {
    const columns = [
        { field: 'date', headerName: 'Date',  width: 300},
        { field: 'no_of_appointments', headerName: 'No. of Appointments', width: 250  },
        { 
            field: 'no_of_closed_appointments',
            headerName: 'No. of Appointment Closed', 
            width: 250
        },
        {
            field: 'no_of_cancelled_appointments',
            headerName: 'No. of Appointment Cancelled',
            width: 250
           
        }
    ];
    const [rows, setRows] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    useEffect(() => {
        fetchAppointmentSummary();
    }, []);

    const fetchAppointmentSummary = async () => {
        
        try {
            const startDate = dayjs(selectedDate, 'YYYY-MM').startOf(
                'month',
            );
            const endDate = dayjs(selectedDate, 'YYYY-MM').endOf(
                'month',
            );
            const formattedStartDate = startDate.format('YYYY-MM-DD');
            const formattedEndDate = endDate.format('YYYY-MM-DD');
            let response = await httpClient.get(
                `${API_END_POINTS.MONTHLY_SUMMARY_REPORT}?start_date=${formattedStartDate}&end_date=${formattedEndDate}`,
            );
            if (!response) {
                throw 'error';
            }

            let { summary } = response.data.data;
            summary = summary.map((el, index) => {
                return { ...el, id: index + 1}
            });
            setRows(summary);
            alert('Monthly appointments summary fetched successfully');

        } catch (error) {
            alert('Failed to get monthly appointments summary');
        }
    }

    const onMonthChange = (event) => {
        console.log(event)
        setSelectedDate(event)
        fetchAppointmentSummary();
    }

    return (
        <div style={{ height: 400, width: '100%' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    onChange={onMonthChange}
                    selected={selectedDate}
                    sx={{ mb: 1 }}
                    slotProps={{ textField: { size: "small" } }}
                    views={['month', 'year']}
                />
            </LocalizationProvider>
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

export default MonthlySummaryReport;