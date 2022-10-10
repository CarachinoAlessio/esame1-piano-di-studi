import {useContext, useState} from 'react';
import {Box, Button, Grid, InputAdornment, Paper, Stack, TextField, Typography} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {useNavigate} from "react-router-dom";
import API from "../API";
import {Alert, AlertTitle} from "@mui/material";
import {DataContext} from "../DataContext";
import LoginIcon from '@mui/icons-material/Login';
import isEmail from 'validator/lib/isEmail';



function ValidateEmail(mail) {
    return isEmail(mail)
}


function LoginComp(props) {

    const [email, setEmail] = useState('testuser@polito.it');
    const [password, setPassword] = useState('password');
    const [loginFailed, setLoginFailed] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    let {setLoggedIn, setStudent, setSearchingPlan} = props
    let emailIsValid = ValidateEmail(email) && email !== ''
    let passwordIsValid = password !== ''
    const {setCoursesInContext, setPlanItemsInContext} = useContext(DataContext)

    const handleSubmit = (event) => {
        event.preventDefault()
        const credentials = {email, password};
        if (emailIsValid && passwordIsValid)
            API.logIn(credentials)
                .then((student) => {
                    setPlanItemsInContext([])
                    setCoursesInContext([])
                    setSearchingPlan(true)
                    setLoggedIn(true)
                    setStudent(student)
                    navigate('/home')
                }).catch((err) => {
                setLoginFailed(true)
            })
    }

    return (

        <Grid
            container
            spacing={0}
            alignItems="center"
            justifyContent="center">
            <Grid item xs={5}>
                <Box component='form' onSubmit={handleSubmit}>
                    <Paper elevation={24}>
                        <Stack spacing={4} sx={{padding: '25px'}}>
                            <Typography variant='h4'>Login</Typography>
                            {loginFailed ?
                                <Alert severity="error">
                                    <AlertTitle>Errore</AlertTitle>
                                    Hai inserito username e/o password <strong>invalidi</strong>
                                </Alert> :
                                ''}
                            <TextField
                                error={!emailIsValid}
                                helperText={email === '' ? 'Il campo email non può essere vuoto' : !emailIsValid ? 'L\'email non è nel formato corretto' : ''}
                                id="email"
                                label="Email"
                                value={email}
                                variant="outlined"
                                onChange={(ev) => setEmail(ev.target.value)}/>
                            <TextField
                                error={!passwordIsValid}
                                helperText={password === '' ? 'Il campo password non può essere vuoto' : ''}
                                id="password"
                                label="Password"
                                type={!showPassword ? 'password' : 'text'}
                                value={password}
                                variant="outlined"
                                onChange={(ev) => setPassword(ev.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onMouseDown={() => setShowPassword(!showPassword)}
                                                onMouseUp={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button startIcon={<LoginIcon></LoginIcon>} type="submit" color={"primary"} size='large' variant="contained">Entra</Button>
                        </Stack>
                    </Paper>
                </Box>
            </Grid>
        </Grid>

    )
}

export {LoginComp}
