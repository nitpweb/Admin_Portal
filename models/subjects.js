const db = require('../db')
const Users = require('./user')

class Subjects {
    /** 
     * @param {number} userId
     * @param {string} email
     * @param {string} imgUrl
     */
    constructor(userId, email, imgUrl) {
        this.userId = userId
        this.email = email || ''
        this.imgUrl = imgUrl || ''
    }
    /**
     * @private
     */
    static get tableName() {
        return 'subjects_teaching'
    }
    /**
     * @returns {Promise<Object>}
     */
    static createTable() {
        const query = `
            CREATE TABLE ${Subjects.tableName} (
                id int NOT NULL AUTO_INCREMENT,
                email varchar(100),
                user_id int NOT NULL,
                subject text NOT NULL,
                PRIMARY KEY(id)
            )AUTO_INCREMENT=20000;
        `
        return db.createTable(this.tableName, query)
    }
    static getSubjects(id) {
        return new Promise((res, rej) => {
            db.find({ user_id: id }, this.tableName)
                .then(results => {
                    res(results)
                })
                .catch(err => {
                    rej(err)
                });
        });
    }

    static getSubjectByUser(userId) {
        return new Promise((resolve, reject) => {
            const query = `select subject from ${this.tableName} where user_id=${userId}`
            db.query(query, (err, results, fields) => {
                if(err) {
                    reject(err)
                }
                let arr = []
                for(let i = 0; i<results.length; i++) {
                    arr.push(results[i].subject)
                }
                resolve(arr)
            })
        })
    }
}
Subjects.createTable()

module.exports = Subjects