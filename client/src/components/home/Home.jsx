import { useEffect, useState } from "react"
import Layout from "../layout/Layout"
import LogIn from "../auth/Login";
import Register from "../auth/Register";
import CommonDialog from "../reusable/dialog/Dialog";
import { useLocation, useNavigate } from "react-router-dom";

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const openSignInDialog = () => {
        setOpenDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const handleShowRegister = () => {
        setShowLogin(false);
    }

    const handleShowLogin = () => {
        setShowLogin(true);
    }

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('schedule-appointment');
        }
    }, [location.pathname, navigate]);

    return (
        <>
            <Layout openSignInDialog={openSignInDialog} showDrawer={false}/>
            <CommonDialog 
                open={openDialog} 
                onClose={handleClose} 
                content={ showLogin ? <LogIn handleShowRegister={handleShowRegister} closeDialog={handleClose}/> : <Register handleShowLogin={handleShowLogin} /> }
            />
        </>
    )
}

export default Home
