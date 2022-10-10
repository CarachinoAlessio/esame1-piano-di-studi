'use strict'

class students_coursesDao {
    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err
        })
    }

    getStudyPlanByStudent(userid) {
        return new Promise((resolve, reject) => {
            const sql = 'select course_code, is_fulltime from students_courses where student_id = ? '
            this.db.all(sql, [userid], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                if (rows.length !== 0){
                    let isFulltime = rows[0].is_fulltime
                    rows = rows.map((r) => ({code: r.course_code}))
                    resolve({isFulltime: isFulltime, planItems: rows})
                }else
                resolve({planItems: []})
            })
        })
    }


    addCourseInPlanForStudentId(userid, toBeAddedInPlan, isFulltime){
        return new Promise((resolve, reject) => {
            const sql = 'insert into students_courses (student_id, course_code, is_fulltime) values(?, ?, ?)';
            this.db.run(sql, [userid, toBeAddedInPlan, isFulltime], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    removeCourseInPlanForStudentId(userid, toBeRemovedFromPlan){
        return new Promise((resolve, reject) => {
            const sql = 'delete from students_courses where student_id == ? and course_code == ?';
            this.db.run(sql, [userid, toBeRemovedFromPlan], function (err) {
                if (err)
                    reject(err);
                else {
                    if (this.changes > 0)
                        resolve();
                    else {
                        reject(new Error("No changes"));
                    }
                }
            });
        });
    }


    deleteStudyPlan(userid) {
        return new Promise((resolve, reject) => {
            let query = "delete from students_courses where student_id == ?";
            this.db.run(query, [userid], function (err) {
                if (err)
                    reject(err);
                else {
                    if (this.changes > 0)
                        resolve();
                    else {
                        reject(new Error("No changes"));
                    }
                }

            });
        });
    }
}


module.exports = students_coursesDao;
