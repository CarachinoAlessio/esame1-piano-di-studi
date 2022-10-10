const express = require("express");
const passport = require('passport'); // auth middleware
const session = require('express-session'); // enable sessions
const studentsCoursesDao = require('../dao/students_coursesDao.js');
const coursesDao = require('../dao/courseDao.js');
const {check, validationResult} = require("express-validator");

const dao = new studentsCoursesDao('study_plan.db');
const courseDao = new coursesDao('study_plan.db')
const router = express.Router();
router.use(express.json());



const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    return res.status(400).json({message: "Not Authenticated"});
}


function checkPreparativeExams(planItems, persistentItem){
    let temp = []
    let x = {}
    let tempPar = [{code: persistentItem.code, mandatory: 'null'}]
    while (tempPar.length !== 0){
        x = tempPar.pop()
        temp.push(x)
        tempPar = [...tempPar, ...planItems.filter((c) => {
            return c.mandatory !== undefined && c.mandatory === x.code
        })]
    }
    temp = temp.filter((t) => t.code !== persistentItem.code)
    let res = temp.length === 0
    if (res) return ''
    else return 'Il corso ' + persistentItem.code + ' non può essere rimosso. Prima rimuovere i corsi che lo hanno come propedeutico'
}

function passPreparativeExam(item, planItems){
    let res = ''
    if (item.mandatory === null)
        res = ''
    else if (planItems.find((i) => i.code === item.mandatory) === undefined)
            res = 'Non puoi aggiungere ' + item.code + ' perchè devi prima aggiungere il suo propedeutico'
    return res
}



function passIncompatibilityConstraint(item, planItems){
    let res = ''
    planItems.map((course) => {
        if (res === '' && course.incompatibility !== null){
            if (course.incompatibility.find((e) => e === item))
                res = 'Non possono esserci corsi incompatibili con ' + item
        }
    })

    return res
}

function passMaxStudentsConstraint(item){
    return !(item.max_students !== null && item.pickedBy >= item.max_students)
}

// set up the session
router.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
router.use(passport.session());


//GET
router.get('/api/studyplan', isLoggedIn, [], async (req, res)=>{
    try{
        const results = await dao.getStudyPlanByStudent(req.user.id);
        return res.status(200).json(results);

    }
    catch(err){
        res.status(500).end();
    }
});


//POST
router.post('/api/confirmStudyPlan', isLoggedIn, [
    check('isFulltime').isBoolean(),
    check('planItems').isArray(),
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    let userid = req.user.id
    let planItems = req.body.planItems
    let isFulltime = req.body.isFulltime
    try{
        let toBeAddedInPlan = []
        let toBeRemovedFromPlan = []
        let studyPlanObj = await dao.getStudyPlanByStudent(req.user.id)
        let studyPlan = studyPlanObj.planItems
        let allCourses = await courseDao.getAllCourses()

        //further validation
        try {
            planItems = planItems.map((item) => {
                if (item.length !== 7){
                    throw 'code is not 7 chars long'
                }
                let x = allCourses.find((course) => course.code === item)
                if (x !== undefined) return x
                else throw 'not found'
            })
        }catch (e) {
            if (e === 'not found')
                return res.status(404).json({error: `Corso non trovato`})
            else return res.status(422).json({error: `I codici devono essere lunghi 7 caratteri`})
        }


        let totCredits = planItems.reduce((acc, p) => acc + p.credits, 0)
        if (isFulltime && (totCredits<60 || totCredits>80)){
            return res.status(422).json({error: 'Il numero di crediti non è in regola con il piano full-time'})

        }else if (!isFulltime && (totCredits<20 || totCredits>40 )){
            return res.status(422).json({error: 'Il numero di crediti non è in regola con il piano part-time'})
        }

        for (let persistentItem of studyPlan){
            if (planItems.find((item) => persistentItem.code === item.code) === undefined) { //se nel piano persistente non trovo uno dei corsi nel nuovo piano,
                                                                                                        // allora questo deve essere rimosso dopo aver verificato che non ci
                                                                                                        //siano problemi di propedeuticità

                let test = checkPreparativeExams(planItems, persistentItem) //non devo avere problemi di propedeuticità nella nuova copia
                if (test === '')
                    toBeRemovedFromPlan.push(persistentItem)
                else return res.status(422).json({error: test})
            }
        }

        for (let item of planItems){
            if (studyPlan.find((persistentItem) => persistentItem.code === item.code) === undefined) {
                let a = passIncompatibilityConstraint(item.code, planItems)
                if (a !== '')
                    return res.status(422).json({error: a})
                let b = passPreparativeExam(item, planItems)
                if (b !== '')
                    return res.status(422).json({error: b})
                let c = passMaxStudentsConstraint(item)
                if (!c)
                    return res.status(422).json({error: 'Limite iscrizioni raggiunto per ' + item.code, error_max_code: item.code})


                toBeAddedInPlan.push(item)

            }
        }


        for (let toBeAdded of toBeAddedInPlan){
            await dao.addCourseInPlanForStudentId(userid, toBeAdded.code, isFulltime)
        }
        for (let toBeRemoved of toBeRemovedFromPlan){
            await dao.removeCourseInPlanForStudentId(userid, toBeRemoved.code, isFulltime)
        }

        return res.status(201).end();


    }
    catch(err){
        res.status(500).end();
    }
});

router.delete('/api/deleteStudyPlan', isLoggedIn, async (req, res) => {
    try {
        let userid = req.user.id

        await dao.deleteStudyPlan(userid);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(503).json({ error: `Database error during the deletion of study plan for user ${req.user.id}.` });
    }
});


module.exports = router;
