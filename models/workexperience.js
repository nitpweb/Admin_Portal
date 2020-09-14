const db = require('../db')

class Workexpreience {
    constructor() {
        /** Not required i.e. why empty */
    }

    static get tableName() {
        return 'Work_Experience';
    }

    static createTable() {
        const query = `
        CREATE TABLE ${Workexpreience.tableName} (
            id int NOT NULL AUTO_INCREMENT,
            user_id int NOT NULL,
            email varchar(250) NOT NULL,
            work_experiences text NOT NULL,
            PRIMARY KEY(id)
        )AUTO_INCREMENT=60000;
        `
        return db.createTable(this.tableName, query);
    }
    static getWorkExperience(id) {
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

    static getWorkExperienceByUser(userId) {
        return new Promise((resolve, reject) => {
            const query = `select work_experiences from ${this.tableName} where user_id=${userId}`
            db.query(query, (err, results, fields) => {
                if (err) {
                    reject(err)
                }
                let arr = []
                for (let i = 0; i < results.length; i++) {
                    arr.push(results[i].work_experiences)
                }
                resolve(arr)
            })
        })
    }
}

Workexpreience.createTable();

module.exports = Workexpreience;