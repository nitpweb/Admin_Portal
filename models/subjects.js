const db = require('../db')
const Users = require('./user')

class Subjects {
    /** 
     * @param {number} name
     * @param {string} email
     * @param {string} subjectName
     */
    constructor(userId, email, subjectName) {
        this.userId = userId
        this.email = email || ''
        this.subjectName = subjectName
    }
    /**
     * @private
     */
    static get tableName() {
        return 'subjects_teaching_in_department'
    }

    /**
     * @returns {Promise<Object>}
     */
    static createTable() {
        const query = `
            CREATE TABLE ${Subjects.tableName} (
                s_no NOT NULL AUTO_INCREMENT,
                email varchar(100),
                userId int NOT NULL,
                subject text NOT NULL,
                PRIMARY KEY(s_no)
                UNIQUE KEY (email)
                FOREIGN KEY(userId) REFERENCES ${User.tableName}(id)
            )AUTO_INCREMENT=1;
        `
        return db.createTable(this.tableName, query)
    }

    static create(subject) {
        const query = `
             INSERT INTO ${Subjects.tableName} SET ?;
        `
        return new Promise((res, rej) => {
            db.query(query, subject, (err, results, fields) => {
                if (err) {
                    console.log(err)
                    rej(err)
                }
            })
            res(results)
        })
    }
}

Subjects.createTable()

module.exports = Subjects