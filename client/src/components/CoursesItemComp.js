import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    Card,
    CardContent,
    Grid,
    Stack,
    TableCell,
    TableRow
} from "@mui/material";
import {useEffect, useState} from "react";
import {IconBadgeErrorComp} from "./IconBadgeErrorComp";


function CoursesItemComp(props) {
    const row = props.row
    let enableSelectCourses = props.enableSelectCourses
    let selectedCourses = props.selectedCourses
    let setSelectedCourses = props.setSelectedCourses
    let setLastSelectAction = props.setLastSelectAction

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if (selectedCourses.find((e) => e.code === row.code) !== undefined) {
            setSelected(true)
        } else {
            setSelected(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCourses])


    return <>
        <TableRow hover selected={selected} sx={{backgroundColor: 'white'}}>
            <TableCell>
                {enableSelectCourses ? (<Stack direction={'row'}>
                    <IconBadgeErrorComp row={row}
                                        selected={selected}
                                        setSelected={setSelected}
                                        setSelectedCourses={setSelectedCourses}
                                        setLastSelectAction={setLastSelectAction}
                    ></IconBadgeErrorComp>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton></Stack>) : <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </IconButton>}

            </TableCell>
            <TableCell component="th" scope="row">
                {row.code}
            </TableCell>
            <TableCell align='center'>{row.name}</TableCell>
            <TableCell align='center'>{row.credits}</TableCell>
            <TableCell align='center'>{row.pickedBy}</TableCell>
            <TableCell align='center'>{row.max_students}</TableCell>
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

export {CoursesItemComp}
