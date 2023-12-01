import { Navigate } from 'react-router-dom';
import Home from '../components/home/Home';
import ScheduleAppointment from '../components/home/ScheduleAppointment';
import BookNewAppointment from '../components/practice/BookNewAppointment';
import BookedAppointment from '../components/practice/BookedAppointment';
import CreatePatient from '../components/practice/CreatePatient';
import Practice from '../components/practice/Practice';
import Patients from '../components/practice/Patients';
import PatientInfo from '../components/practice/PatientInfo';
import CreateAppointment from '../components/practice/CreateAppointment';

const routes = [
    {
      path: '/',
      component: <Home />,
      exact: true,
      children: [
        {
          path: 'schedule-appointment',
          component: <ScheduleAppointment />,
          exact: true
        }]
    },
    {
      path: 'practice',
      component: <Practice />,
      exact: true,
      children: [{
        path: '/practice',
        component: <Navigate to="/practice/view-booked-appointment" />,
        exact: true
      },
      {
        path: 'create-appointment',
        component: <CreateAppointment />,
        exact: true
      },
      {
        path: 'book-appointment',
        component: <BookNewAppointment />,
        exact: true
      },
      {
        path: 'create-patient',
        component: <CreatePatient />,
        exact: true
      },
      {
        path: 'view-booked-appointment',
        component: <BookedAppointment />,
        exact: true
      },
      {
        path: 'view-patient',
        component: <Patients />,
        exact: true
      },
      {
        path: 'patient-info',
        component: <PatientInfo />,
        exact: true
      }]
    }
];

export default routes;