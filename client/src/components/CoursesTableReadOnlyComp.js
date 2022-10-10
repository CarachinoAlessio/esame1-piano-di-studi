import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import {CoursesItemReadOnlyComp} from "./CoursesItemReadOnlyComp";
import Typography from "@mui/material/Typography";


function CoursesTableReadOnlyComp(props) {
    let courses = props.courses;


    return (<>
            <Typography variant='h3' sx={{marginLeft: '20px'}}>Corsi</Typography>
            <TableContainer component={Paper} elevation={15}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Codice</TableCell>
                            <TableCell align='center'>Nome</TableCell>
                            <TableCell align='center'>Numero di crediti&nbsp;</TableCell>
                            <TableCell align='center'>Scelto da&nbsp;</TableCell>
                            <TableCell align='center'>Studenti massimi&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((row) => (
                            <CoursesItemReadOnlyComp key={row.code} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    );
}

export {CoursesTableReadOnlyComp}


