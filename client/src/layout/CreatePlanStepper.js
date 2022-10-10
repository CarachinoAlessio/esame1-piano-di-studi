import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useContext, useEffect, useState} from "react";
import {Card, CardActionArea, CardContent, Grid, Snackbar, Alert, AlertTitle} from "@mui/material";
import {StudyPlanTableComp} from "../components/StudyPlanTableComp";
import {DataContext} from "../DataContext";
import API from "../API";
import {validatePlan} from "../utils/courses_utils";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';

const steps = ['Scegli tipo carriera', 'Seleziona corsi'];

function CreatePlanStepper(props) {

    const {planItems, setPlanItems, setCourses, setSelectedCourses, setEnableSelectCourses, fulltimePick, setFulltimePick, setPlanFound, setDirtyCourses, setStartCreate, selectedCourses} = props
    const [activeStep, setActiveStep] = useState(0);
    const [canConfirm, setCanConfirm] = useState(false)
    const [openSnackResult, setOpenSnackResult] = useState(false)
    const [errorMAXCODE, setErrorMAXCODE] = useState('')
    const [errorConstraint, setErrorConstraint] = useState('')
    const {coursesInContext, planItemsInContext} = useContext(DataContext)

    useEffect(() => {
        if (activeStep !== 1) {
            setSelectedCourses([])
            setEnableSelectCourses(false)
            setCourses(() => JSON.parse(JSON.stringify(coursesInContext))) //this is the only working clone method
            setPlanItems(() => JSON.parse(JSON.stringify(planItemsInContext)))
        }
        else setEnableSelectCourses(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStep])

    useEffect(() => {
        let min, max
        if (fulltimePick){
            min = 60
            max = 80
        }else {
            min = 20
            max = 40
        }
        let tot = planItems.reduce((acc, e) => acc + e.credits, 0)
        if (tot >= min && tot <= max ){
            setCanConfirm(() => true)
        }
        else setCanConfirm(() => false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [planItems.length])


    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
            return prevActiveStep + 1
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
            return prevActiveStep - 1
        });
    };

    const confirmPlan = () => {
        const validationResult = validatePlan(planItems, planItemsInContext, fulltimePick)
        if (validationResult === ''){
            const confirmStudyPlan = API.confirmStudyPlan(planItems, fulltimePick)
            confirmStudyPlan.then((ok) => {

                setOpenSnackResult(true)
                setPlanFound(() => true)
                setEnableSelectCourses(() => false)
                setDirtyCourses(true)
                setStartCreate(false)

            }).catch((obj) => {
                console.log(obj)
                if (obj.error_max_code){
                    setErrorMAXCODE(obj.error_max_code)
                    setOpenSnackResult(true)
                }
                else{
                    setErrorConstraint(obj.error + '. *Ho aggiornato i corsi (e i loro vincoli/numero massimo di studenti) e ripristinato l\'ultima copia persistente del piano così che si possa correggere sulla base di dati consistenti')
                    setOpenSnackResult(true)
                }
                setDirtyCourses(true)
            });
        }
        else {
            setErrorConstraint(validationResult + '. *Ho aggiornato i corsi (e i loro vincoli/numero massimo di studenti) e ripristinato l\'ultima copia persistente del piano così che si possa correggere sulla base di dati consistenti')
            setOpenSnackResult(true)
            setDirtyCourses(true)
        }
    }

    const closeSnackResult = () => {
        setOpenSnackResult(false)
        setErrorMAXCODE('')
        setErrorConstraint('')
    }

    const action = (
        <IconButton
            size="small"
            aria-label="chiudi"
            color="inherit"
            onClick={() => closeSnackResult()}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );

    return (
        <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => {
                    return (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === 0 ?
                <>
                    <Grid container spacing={2}
                          justifyContent="center"
                          alignItems="center"
                          sx={{paddingTop: '35px', paddingBottom: '20px'}}>
                        <Grid item xs={3}>
                            <Card raised={true}>
                                <CardActionArea onClick={() => setFulltimePick(true)}
                                                style={fulltimePick ? {backgroundColor: '#ccddff'} : {}}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            Full time
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Compila il piano di studi scegliendo un numero di crediti
                                            tra <strong>60</strong> e <strong>80</strong>
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        <Grid item xs={3}>
                            <Card raised={true}>
                                <CardActionArea onClick={() => setFulltimePick(false)}
                                                style={!fulltimePick ? {backgroundColor: '#ccddff'} : {}}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            Part time
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Compila il piano di studi scegliendo un numero di crediti
                                            tra <strong>20</strong> e <strong>40</strong>
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Grid>


                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <Button
                            color="inherit"
                            variant={'contained'}
                            disabled
                            onClick={handleBack}
                            size={'medium'}
                        >
                            Indietro
                        </Button>
                        <Box sx={{flex: '1 1 auto'}}/>
                        <Button onClick={handleNext} color={'primary'} variant={'contained'} size={'medium'}>
                            Avanti
                        </Button>
                    </Box></>
                :
                    <>
                        <StudyPlanTableComp planItems={planItems} setPlanItems={setPlanItems} setCourses={setCourses} mode='create' fulltimePick={fulltimePick} selectedCourses={selectedCourses}></StudyPlanTableComp>
                        <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                            <Button
                                color="secondary"
                                variant={'contained'}
                                onClick={handleBack}
                                size={'medium'}
                            >
                                Indietro
                            </Button>
                            <Box sx={{flex: '1 1 auto'}}/>
                            <Button disabled={!canConfirm} onClick={confirmPlan} color={'primary'} variant={'contained'} size={'medium'}>
                                Conferma piano
                            </Button>
                            <Snackbar sx={{width: '80%'}} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackResult} autoHideDuration={10000} onClose={closeSnackResult}>
                                {errorMAXCODE ? <Alert open={openSnackResult} action={action} severity={'error'} sx={{width: '100%'}}>
                                    <AlertTitle>Errore</AlertTitle>
                                    Il corso con codice <strong>{errorMAXCODE}</strong> ha raggiunto il numero massimo di studenti. *Ho aggiornato i corsi (e i loro vincoli/numero massimo di studenti) e ripristinato l'ultima copia persistente del piano così che si possa correggere sulla base di dati consistenti
                                </Alert> : <Alert open={openSnackResult} action={action} severity={'error'} sx={{width: '100%'}}>
                                    <AlertTitle>Errore</AlertTitle>
                                    {errorConstraint}
                                </Alert>}
                            </Snackbar>

                        </Box>
                    </>
            }
        </Box>
    );
}

export {CreatePlanStepper}
