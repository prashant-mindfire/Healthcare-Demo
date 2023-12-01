import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import httpClient from '../../shared/HttpClient';
import API_END_POINTS from '../../shared/ApiEndPoints';
import CommonDialog from '../reusable/dialog/Dialog';
import BookAppointment from './BookAppointment';

export default function DoctorCard() {
    const [openDialog, setOpenDialog] = useState(false);
    const [doctor, setDoctor] = useState({});
    const [doctorList, setDoctorList] = useState([]);

    useEffect(() => {
        fetchDoctorsList();
    }, []);

    const handleClose = () => {
        setOpenDialog(false);
    }

    const fetchDoctorsList = async () => {
        try {
            const doctorsListResponse = await httpClient.get(`${API_END_POINTS.FETCH_DOCTORS}`);
            if (!doctorsListResponse) {
                throw 'failed';
            }

            let { doctors } = doctorsListResponse.data.data;
            setDoctorList(doctors);
        } catch (error) {
            const errorMessage = error ? error : 'Failed to get doctors list';
            alert(errorMessage);
        }
    }

    const showAppointmentBook = (doctor) => {
        setDoctor(doctor)
        setOpenDialog(true);
    }

    return (
        <>
            <Container disableGutters sx={{ maxWidth: 1000, display: 'flex', gap: 2, flex: 'wrap' }}>
                {
                    doctorList.map((doctor, index) => (
                        <Card key={index} sx={{ minWidth: 300 }}>
                            <CardHeader
                                title={
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <div style={{ fontSize: '.8rem' }}>{doctor.name}</div>
                                            <Button onClick={() => showAppointmentBook(doctor)} variant="outlined" color="success" size="small" sx={{ textTransform: 'capitalize' }} >
                                                Book Clinic Visit
                                            </Button>
                                        </div>
                                        <div style={{ display: 'flex', gap: 5 }}>
                                            <Rating name="size-small" defaultValue={3.5} precision={0.5} size="small" />
                                            <span style={{ fontSize: '.9rem' }}>3.5 (413)</span>
                                        </div>
                                    </div>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 15 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Book an appointment for <span style={{ fontWeight: '600'}}>consultation</span>
                                    </Typography>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 10 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 2 }}>
                                            <div style={{ fontSize: '.9rem' }}>Morning</div>
                                            <Stack direction="row" spacing={1}>
                                                {
                                                    doctor.day_start_time.map((time, index) => (
                                                        <Chip label={time} key={index}/>
                                                    ))
                                                }
                                            </Stack>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 2 }}>
                                            <div style={{ fontSize: '.9rem' }}>Evening</div>
                                            <Stack direction="row" spacing={1}>
                                                {
                                                    doctor.day_end_time.map((time, index) => (
                                                        <Chip label={time} key={index}/>
                                                    ))
                                                }
                                            </Stack>
                                        </div>
                                    </div>
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
                        )
                    )
                }
            </Container>
            <CommonDialog 
                open={openDialog} 
                onClose={handleClose} 
                content={ <BookAppointment  doctor={doctor} closeDialog={handleClose}/> }
            />
        </>
    )
}