const express = require("express");
const courseDao = require('../dao/courseDao');
const db = new courseDao('study_plan.db');

const router = express.Router();
router.use(express.json());

//GET
router.get('/api/courses', async (req,res)=>{
    try{
        const results = await db.getAllCourses();
        return res.status(200).json(results);
    }
    catch(err){
        res.status(500).end();
    }
});





module.exports = router;
