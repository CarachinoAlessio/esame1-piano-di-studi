import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import {StudyPlanItemReadOnlyComp} from "./StudyPlanItemReadOnlyComp";


function StudyPlanReadOnlyComp(props) {
    let planItems = props.planItems;


    return (<>
            <TableContainer component={Paper} elevation={15}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Codice</TableCell>
                            <TableCell align='center'>Nome</TableCell>
                            <TableCell align='center'>Numero di crediti&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {planItems.map((row) => (
                            <StudyPlanItemReadOnlyComp key={row.code} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    );
}

export {StudyPlanReadOnlyComp}


