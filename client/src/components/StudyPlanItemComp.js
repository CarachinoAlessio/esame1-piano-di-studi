import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    Alert, AlertTitle,
    Card,
    CardContent,
    Grid,
    Snackbar,
    TableCell,
    TableRow, Tooltip
} from "@mui/material";
import {useState} from "react";
import {Delete} from "@mui/icons-material";



function StudyPlanItemComp(props) {
    const row = props.row
    const getMandatoriesForItem = props.getMandatoriesForItem
    const removeItemFromPlan = props.removeItemFromPlan
    const enableDelete = props.enableDelete
    const [open, setOpen] = useState(false);
    const [errorOnRemoving, setErrorOnRemoving] = useState('')


    const handleClose = () => {
        setErrorOnRemoving('');
    };

    function removeItem(){
        let preparativesForCode = getMandatoriesForItem(row.code)
        if (preparativesForCode.length === 1){
            setErrorOnRemoving('Prima rimuovere il corso ' + preparativesForCode[0])
        }else if (preparativesForCode.length >= 2){
            setErrorOnRemoving('Prima rimuovere i corsi ' + preparativesForCode.toString())
        }else {
            setErrorOnRemoving('')
            removeItemFromPlan(row.code)
        }
    }


    return <>
        <TableRow hover>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                { !enableDelete ?
                    <>
                        <Tooltip title='Deseleziona i corsi per poter rimuovere'>
                            <IconButton
                                aria-label="rimuovi"
                                size="small"
                            >
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </>
                    : <IconButton
                    aria-label="rimuovi"
                    size="small"
                    color={'error'}
                    onClick={() => removeItem()}
                >
                    <Delete />
                </IconButton>}
                <Snackbar open={errorOnRemoving !== ''} autoHideDuration={3500} onClose={() => handleClose()} >
                    <Alert severity={'error'} sx={{width: '100%'}}>
                        <AlertTitle>Errore</AlertTitle>
                        {errorOnRemoving}
                    </Alert>
                </Snackbar>
            </TableCell>
            <TableCell component="th" scope="row">
                {row.code}
            </TableCell>
            <TableCell align='center' >{row.name}</TableCell>
            <TableCell align='center' >{row.credits}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Grid container spacing={5}
                          justifyContent="center"
                          alignItems="center"
                    >
                        <Grid item xs={5}>
                            <Card>
                                <CardContent>
                                    <Typography gutterBottom variant="subtitle1" component="div">
                                        Propedeutici
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {row.mandatory ? row.mandatory : 'Nessuno'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={5}>
                            <Card>
                                <CardContent>
                                    <Typography gutterBottom variant="subtitle1" component="div">
                                        Incompatibili
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {row.incompatibility !== null ? row.incompatibility.map((m) => m + ' ') : 'Nessuno'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
}
export {StudyPlanItemComp}
