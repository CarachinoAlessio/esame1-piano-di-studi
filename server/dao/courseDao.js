'use strict'

class courseDao {
    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err
        })
    }

    getAllCourses() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT courses.code, courses.name, courses.credits, courses.max_students, courses.incompatibility, courses.mandatory, COUNT(student_id) as pickedBy\n' +
                'FROM courses\n' +
                'LEFT JOIN students_courses on courses.code = students_courses.course_code\n' +
                'GROUP BY courses.code'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                rows.map((row) => {
                    if (row.incompatibility)
                        row.incompatibility = JSON.parse(row.incompatibility)
                })

                resolve(rows)
            })
        })
    }
}

module.exports = courseDao
