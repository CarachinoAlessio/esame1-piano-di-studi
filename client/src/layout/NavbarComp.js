import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {Biotech} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

export default function NavbarComp(props) {
    const navigate = useNavigate();
    let loggedIn = props.loggedIn

    const handleLogoutClick = () => {
        props.doLogout()
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="Polito Exams"
                        sx={{mr: 2}}
                        onClick={() => {if (!loggedIn) {
                            navigate('/')
                        }}}

                    >
                        <Biotech></Biotech>
                    </IconButton>
                    <Typography style={{cursor: "pointer"}} onClick={() => {
                        if (!loggedIn) {
                            navigate('/')
                        }

                    }} variant="h6" component="div" sx={{flexGrow: 1}}>
                        Polito Exams
                    </Typography>
                    {loggedIn ? <Typography variant='h6'>Benvenuto {props.student.email}</Typography> : ''}
                    {!loggedIn ? <Button size='large' sx={{fontSize: '16px'}} color="inherit" onClick={() => navigate('login')}>Login</Button> :
                        <Button size='large' sx={{fontSize: '16px'}} color="inherit" onClick={() => handleLogoutClick()}>Logout</Button>}

                </Toolbar>
            </AppBar>
        </Box>
    );
}


export {NavbarComp}
