import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    Card,
    CardContent,
    Grid,
    TableCell,
    TableRow
} from "@mui/material";
import {useState} from "react";


function StudyPlanItemReadOnlyComp(props) {
    const row = props.row
    const [open, setOpen] = useState(false);

    return <>
        <TableRow hover selected={false} sx={{backgroundColor: 'white'}}>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </IconButton>

            </TableCell>
            <TableCell component="th" scope="row">
                {row.code}
            </TableCell>
            <TableCell align='center'>{row.name}</TableCell>
            <TableCell align='center'>{row.credits}</TableCell>
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

export {StudyPlanItemReadOnlyComp}
