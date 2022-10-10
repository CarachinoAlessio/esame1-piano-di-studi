import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {CoursesTableComp} from "../components/CoursesTableComp";
import {CreatePlanStepper} from "./CreatePlanStepper";
import {Container, Paper, Stack} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {DataContext} from "../DataContext";
import {CoursesTableReadOnlyComp} from "../components/CoursesTableReadOnlyComp";
import {StudyPlanReadOnlyComp} from "../components/StudyPlanReadOnlyComp";
import {EditPlanStepper} from "./EditPlanStepper";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API from "../API";

export default function HomePageComp(props) {
    let courses = props.courses
    let setCourses = props.setCourses
    let searchingPlan = props.searchingPlan
    let setSearchingPlan = props.setSearchingPlan
    let planItems = props.planItems
    let setPlanItems = props.setPlanItems
    let enableSelectCourses = props.enableSelectCourses
    let setEnableSelectCourses = props.setEnableSelectCourses
    let setDirtyCourses = props.setDirtyCourses

    const [startCreate, setStartCreate] = useState(false)
    const [startEdit, setStartEdit] = useState(false)
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [lastSelectAction, setLastSelectAction] = useState({})
    const [fulltimePick, setFulltimePick] = useState(true);
    const {planItemsInContext, persistentIsFulltime} = useContext(DataContext)

    useEffect(() => {
        if (persistentIsFulltime !== undefined){
            setFulltimePick(() => persistentIsFulltime)
        }
    }, [persistentIsFulltime])

    const [planFound, setPlanFound] = useState(false)

    useEffect(() => {
        if (planItemsInContext.length > 0) {
            setPlanFound(() => true)
        }
    }, [planItemsInContext.length])

    useEffect(() => {
            if (searchingPlan && planFound)
                setSearchingPlan(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[planFound])


    return (
        <>
            {searchingPlan ? '' :
                planFound && !startEdit ?
                    <>
                        <Paper elevation={24}>
                            <Stack spacing={1} sx={{padding: '25px'}}>
                                <Typography variant='h3' sx={{marginLeft: '20px'}}>Il tuo piano di studi {persistentIsFulltime ? 'Full Time' : 'Part time'}</Typography>
                                <StudyPlanReadOnlyComp planItems={planItems}></StudyPlanReadOnlyComp>
                                <Button startIcon={<EditIcon></EditIcon>} color={"primary"} size='large' onClick={() => setStartEdit(true)}
                                        variant="contained">Modifica</Button>
                                <Button startIcon={<DeleteIcon></DeleteIcon>} color={"secondary"} size='large' onClick={() => API.deletePersistentStudyPlan().then(() => {
                                    setDirtyCourses(true)
                                    setPlanItems(() => [])
                                    setPlanFound(false)
                                })
                                }
                                        variant="contained">Elimina piano</Button>
                            </Stack>
                        </Paper>
                        <div style={{paddingTop: '30px'}}></div>
                        <CoursesTableReadOnlyComp courses={courses}></CoursesTableReadOnlyComp></>
                    :
                    planFound && startEdit ?
                        <>
                            <Paper elevation={24}>
                                <Container style={{padding: '25px'}}>
                                    <EditPlanStepper planItems={planItems}
                                                     setPlanItems={setPlanItems}
                                                     setSelectedCourses={setSelectedCourses}
                                                     setEnableSelectCourses={setEnableSelectCourses}
                                                     setCourses={setCourses}
                                                     fulltimePick={fulltimePick}
                                                     setFulltimePick={setFulltimePick}
                                                     setPlanFound={setPlanFound}
                                                     setStartEdit={setStartEdit}
                                                     setDirtyCourses={setDirtyCourses}
                                                     selectedCourses={selectedCourses}
                                    ></EditPlanStepper>
                                </Container>
                            </Paper>
                            <div style={{paddingTop: '30px'}}></div>
                            <Typography variant='h3' sx={{marginLeft: '20px'}}>Corsi</Typography>
                            <CoursesTableComp courses={courses}
                                              setCourses={setCourses}
                                              selectedCourses={selectedCourses}
                                              setSelectedCourses={setSelectedCourses}
                                              enableSelectCourses={enableSelectCourses}
                                              lastSelectAction={lastSelectAction}
                                              setLastSelectAction={setLastSelectAction}
                                              planItems={planItems}
                                              setPlanItems={setPlanItems}
                                              fulltimePick={fulltimePick}
                            ></CoursesTableComp>
                        </>
                        :
                        !planFound && !startCreate && !searchingPlan ?
                            <>
                                <Paper elevation={24}>
                                    <Stack spacing={5} sx={{padding: '25px'}}>
                                        <Typography variant='h4'>Oops</Typography>
                                        <Typography variant='h6'>Sembra che tu non abbia ancora compilato il piano di
                                            studi</Typography>
                                        <Button color={"primary"} size='large' onClick={() => setStartCreate(true)}
                                                variant="contained">Compilalo ora!</Button>
                                    </Stack>
                                </Paper>
                                <div style={{paddingTop: '30px'}}></div>
                                <Typography variant='h3' sx={{marginLeft: '20px'}}>Corsi</Typography>
                                <CoursesTableComp courses={courses}
                                                  setCourses={setCourses}
                                                  selectedCourses={selectedCourses}
                                                  setSelectedCourses={setSelectedCourses}
                                                  enableSelectCourses={enableSelectCourses}
                                                  lastSelectAction={lastSelectAction}
                                                  setLastSelectAction={setLastSelectAction}
                                                  planItems={planItems}
                                                  setPlanItems={setPlanItems}
                                                  fulltimePick={fulltimePick}
                                ></CoursesTableComp>
                            </>
                            :
                            !planFound && startCreate ?
                                <>

                                    <Paper elevation={24}>
                                        <Container style={{padding: '25px'}}>
                                            <CreatePlanStepper planItems={planItems}
                                                               setPlanItems={setPlanItems}
                                                               setSelectedCourses={setSelectedCourses}
                                                               setEnableSelectCourses={setEnableSelectCourses}
                                                               setCourses={setCourses}
                                                               fulltimePick={fulltimePick}
                                                               setFulltimePick={setFulltimePick}
                                                               setPlanFound={setPlanFound}
                                                               setDirtyCourses={setDirtyCourses}
                                                               setStartCreate={setStartCreate}
                                                               selectedCourses={selectedCourses}
                                            ></CreatePlanStepper>
                                        </Container>
                                    </Paper>
                                    <div style={{paddingTop: '30px'}}></div>
                                    <Typography variant='h3' sx={{marginLeft: '20px'}}>Corsi</Typography>
                                    <CoursesTableComp courses={courses}
                                                      setCourses={setCourses}
                                                      selectedCourses={selectedCourses}
                                                      setSelectedCourses={setSelectedCourses}
                                                      enableSelectCourses={enableSelectCourses}
                                                      lastSelectAction={lastSelectAction}
                                                      setLastSelectAction={setLastSelectAction}
                                                      planItems={planItems}
                                                      setPlanItems={setPlanItems}
                                                      fulltimePick={fulltimePick}
                                    ></CoursesTableComp>
                                </>
                                : ''
            }


            <div style={{paddingTop: '50px'}}></div>
        </>
    );
}


export {HomePageComp}
