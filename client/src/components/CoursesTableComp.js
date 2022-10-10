import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {CoursesItemComp} from "./CoursesItemComp";
import {
    attachClientInfo, getMandatoriesForCode,
    refreshCoursesErrorsOnNewSelected,
    refreshCoursesErrorsOnRemovedSelected, sortByCourseName,
} from "../utils/courses_utils";
import { Snackbar} from "@mui/material";

import {useContext, useEffect} from "react";
import Button from "@mui/material/Button";
import {DataContext} from "../DataContext";


    const CoursesSelectionSnackBar = (props) => {
        const { courses, selectedCourses, setSelectedCourses, setCourses, planItems, setPlanItems, fullTimePick } = props;

        const {coursesInContext} = useContext(DataContext)
        let numSelected = selectedCourses.length


        async function confirmCourses() {
            setPlanItems(() => {
                let newItems = [...planItems, ...selectedCourses]
                attachClientInfo(courses, setCourses, newItems, undefined)
                return sortByCourseName(newItems)
            })
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setSelectedCourses(() => [])
        }

        let {planItemsInContext} = useContext(DataContext)

        function deselectAll() {
            setSelectedCourses(() => [])
            if (planItemsInContext.length === 0 && planItems.length === 0)
                setCourses(() => JSON.parse(JSON.stringify(coursesInContext))) //this is the only working clone method
            else
                attachClientInfo(courses, setCourses, planItems, undefined)
        }

        const action = (
            <>
                <Button disabled={selectedCourses.reduce((acc, e) => acc + e.credits, 0) + planItems.reduce((acc, e) => acc + e.credits, 0) > (fullTimePick ? 80 : 40)}
                         color={'primary'}
                         size="small"
                         variant={"contained"}
                         onClick={confirmCourses} >
                    Aggiungi i corsi selezionati al piano
                </Button>
                <div style={{paddingRight: '10px'}}/>
                <Button color="secondary" size="small" variant={"outlined"} onClick={deselectAll}>
                    Annulla la selezione
                </Button>
            </>
        );

        return (
            <>
                {numSelected > 0 ?
                    <div>
                        <Snackbar
                            open={numSelected > 0}
                            message= {selectedCourses.reduce((acc, e) => acc + e.credits, 0)  + ' crediti selezionati'}
                            action={action}
                        />
                    </div>
                    :
                    ''}
            </>

        )
    };

function CoursesTableComp(props) {
    let courses = props.courses;
    let setCourses = props.setCourses
    let selectedCourses = props.selectedCourses
    let setSelectedCourses = props.setSelectedCourses
    let lastSelectAction = props.lastSelectAction
    let setLastSelectAction = props.setLastSelectAction
    let planItems = props.planItems
    let setPlanItems = props.setPlanItems
    let fulltimePick = props.fulltimePick

    let enableSelectCourses = props.enableSelectCourses

    useEffect(() => {
        if (enableSelectCourses === false)
            setSelectedCourses(() => [])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[enableSelectCourses])

    useEffect(() => {
        if (JSON.stringify(lastSelectAction) !== '{}'){
            if(lastSelectAction.added){
                refreshCoursesErrorsOnNewSelected(courses, setCourses, lastSelectAction.added)
            }
            else{
                let mandatoriesFor = getMandatoriesForCode(courses, lastSelectAction.removed)
                if (mandatoriesFor.length !== 0){
                    let toBeRemoved = selectedCourses.filter((selected) => mandatoriesFor.find((d) => d.code === selected.code) !== undefined)
                    if (toBeRemoved.length !== 0)
                        toBeRemoved.forEach((toBeRem) => {refreshCoursesErrorsOnRemovedSelected(courses, setCourses, toBeRem.code)})
                }
                setSelectedCourses((old) => old.filter(
                    (selected) =>
                        mandatoriesFor.find((codeToDeselect) => selected.code === codeToDeselect.code) === undefined))

                refreshCoursesErrorsOnRemovedSelected(courses, setCourses, lastSelectAction.removed)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastSelectAction])

    return (<>
            <CoursesSelectionSnackBar
                selectedCourses={selectedCourses}
                setSelectedCourses={setSelectedCourses}
                courses={courses}
                setCourses={setCourses}
                planItems={planItems}
                setPlanItems={setPlanItems}
                fullTimePick={fulltimePick}
            ></CoursesSelectionSnackBar>
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
                            <CoursesItemComp enableSelectCourses={enableSelectCourses}
                                             selectedCourses={selectedCourses}
                                             setSelectedCourses={setSelectedCourses}
                                             setLastSelectAction={setLastSelectAction}
                                             key={row.code} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
    </>

    );
}

export {CoursesTableComp}

