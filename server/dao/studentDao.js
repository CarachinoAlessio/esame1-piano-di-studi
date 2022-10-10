'use strict';

/* Data Access Object (DAO) module for accessing users */

class studentDao {
    sqlite = require('sqlite3');
    crypto = require('crypto');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err
        })
    }

    getStudentById = (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM students WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err)
                    reject(err);
                else if (row === undefined)
                    resolve({error: 'Student not found.'});
                else {
                    // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
                    const student = {id: row.id, email: row.email, name: row.name}
                    resolve(student);
                }
            });
        });
    };

    getStudent = (email, password) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM students WHERE email = ?';
            this.db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                } else {
                    const student = {id: row.id, email: row.email, name: row.name};

                    const salt = row.salt;
                    this.crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                        if (err) reject(err);

                        const passwordHex = Buffer.from(row.hash, 'hex');

                        if (!this.crypto.timingSafeEqual(passwordHex, hashedPassword))
                            resolve(false);
                        else resolve(student);
                    });
                }
            });
        });
    };
}


module.exports = studentDao;
