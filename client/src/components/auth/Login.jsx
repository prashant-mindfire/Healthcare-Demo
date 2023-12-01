import { yupResolver } from '@hookform/resolvers/yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import * as yup from "yup";
import Copyright from './Copyright';

const loginValidationSchema = yup.object({
    email: yup.string().trim().email('Please enter valid email').required('Email is required'),
    password: yup.string().trim().required('Password is required')
}).required();

const USER_NAME = 'testpractice@gmail.com';
const PASSWORD = 'testpractice123';

const LogIn = ({handleShowRegister, closeDialog}) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(loginValidationSchema)
    });
    const defaultTheme = createTheme();

    const onSubmit = async(data) => {
        try {
            let { email, password } = data;
            if (email === USER_NAME && password === PASSWORD) {
                // notify('Practice login successfully !', 'success');
                // alert('Practice login successfully !');
                closeDialog();
                navigate('/practice');
            } else {
                throw 'INVALID_CRED';
            }

        } catch (error) {
            const errorMessage = error === 'INVALID_CRED' ? 'Invalid username or password' : 'Something went wrong';
            notify(errorMessage, 'error');
        } 
    }

    const notify = (message, type) => {
        toast[type](message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: 'colored'
        });
    }

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            // marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                size="small"
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                size="small"
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary"/>}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                    Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link sx={{cursor: 'pointer'}} variant="body2" onClick={handleShowRegister}>
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                    </Box>
                    <Copyright sx={{ mt: 6, mb: 3 }} />
                </Container>
            </ThemeProvider>
            <ToastContainer />
        </>
    );
}

LogIn.propTypes = {
    handleShowRegister: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired
}

export default LogIn