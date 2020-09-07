const db = require('../db')

class PhdCandidates {
    constructor() {

    }

    static get tableName() {
        return 'Phd_Candidates';
    }

    static createTable() {
        const query = `
        CREATE TABLE ${PhdCandidates.tableName} (
            id int NOT NULL AUTO_INCREMENT,
            user_id int NOT NULL,
            email varchar(250) NOT NULL,
            phd_student_name text NOT NULL,
            thesis_topic text NOT NULL,
            start_year varchar(10) NOT NULL,
            completion_year varchar(10) NOT NULL,
            PRIMARY KEY(id)
        )AUTO_INCREMENT=120000;
        `
        return db.createTable(this.tableName, query);
    }
    static getPhdCandidates(id) {
        return new Promise((res, rej) => {
            db.find({ user_id: id }, this.tableName)
                .then(results => {
                    res(results)
                })
                .catch(err => {
                    rej(err)
                })
        })
    }

    static getCandidatesByUser(userId) {
        return new Promise((resolve, reject) => {
            const query = `select phd_student_name,thesis_topic,start_year,completion_year from ${this.tableName} where user_id=${userId}`
            db.query(query, (err, results, fields) => {
                if (err) {
                    reject(err)
                }
                let arr = []
                for (let i = 0; i < results.length; i++) {
                    arr.push(results[i])
                }
                resolve(arr)
            })
        })
    }
}

PhdCandidates.createTable();

module.exports = PhdCandidates;