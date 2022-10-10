import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Container, Typography} from "@mui/material";
import {StudyPlanItemComp} from "./StudyPlanItemComp";
import {getMandatoriesForCode, refreshCoursesErrorsOnRemovedFromPlan} from "../utils/courses_utils";
import {useEffect, useState} from "react";

const EnhancedTableToolbar = (props) => {
    const planItems = props.planItems
    const fulltimePick = props.fulltimePick
    let creditsInPlan = planItems.reduce((acc, i) => acc + i.credits, 0)

    return (
        <Container sx={{paddingTop: '30px', paddingBottom: '15px'}}>
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h5"
                id="tableTitle"
                component="div"
            >
                Seleziona i corsi dall'elenco in basso
            </Typography>
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                component="div"
            >
                {fulltimePick === true ?  + creditsInPlan + ' crediti selezionati, puoi sceglierne minimo 60 e massimo 80'
                    : planItems.reduce((acc, i) => acc + i.credits, 0) + ' crediti selezionati, puoi sceglierne minimo 20 e massimo 40'}
            </Typography>
        </Container>
    )


};

function StudyPlanTableComp(props) {
    const {planItems, setPlanItems, setCourses, fulltimePick, selectedCourses} = props
    const [enableDelete, setEnableDelete] = useState(true)

    useEffect(() => {
       if (selectedCourses.length === 0){
           setEnableDelete(true)
       }
       else setEnableDelete(false)
    }, [selectedCourses.length])


    function getMandatoriesForItem(code){
        let dependencies = getMandatoriesForCode(planItems, code)
        return dependencies.filter((d) => planItems.find((i) => i.code === d.code) !== undefined).map((d) => d.code)
    }

    function removeItemFromPlan(code){
        setPlanItems((old) => old.filter((i) => i.code !== code))
        setCourses((old) => refreshCoursesErrorsOnRemovedFromPlan(old, code))
    }

    return (<>
            <EnhancedTableToolbar planItems={planItems} fulltimePick={fulltimePick}></EnhancedTableToolbar>
            <TableContainer component={Paper} elevation={0}>
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
                        {planItems.length === 0 ? (
                            <TableRow>
                                <TableCell>

                                </TableCell>
                                <TableCell component="th" scope="row">Ancora nessun corso inserito</TableCell>
                            </TableRow>)
                            :
                            planItems.map((row) => (
                                    <StudyPlanItemComp key={row.code} row={row} getMandatoriesForItem={getMandatoriesForItem} removeItemFromPlan={removeItemFromPlan} enableDelete={enableDelete}/>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    );
}

export {StudyPlanTableComp}

