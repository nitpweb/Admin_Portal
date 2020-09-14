const db = require('../db')
const Users = require('./user')

class Past_Responsibility {

    constructor(userId, email, imgUrl) {

    }
    /**
     * @private
     */
    static get tableName() {
        return 'past_admin_responsibility'
    }

    /**
     * @returns {Promise<Object>}
     */
    static createTable() {
        const query = `
            CREATE TABLE ${Past_Responsibility.tableName} (
                id int NOT NULL AUTO_INCREMENT,
                email varchar(100),
                user_id int NOT NULL,
                past_responsibility text NOT NULL,
                PRIMARY KEY(id)
            )AUTO_INCREMENT=4500;
        `
        return db.createTable(this.tableName, query)
    }
    static getReponsibility(id) {
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

    static getResponsibilityByUser(userId) {
        return new Promise((resolve, reject) => {
            const query = `select past_responsibility from ${this.tableName} where user_id=${userId}`
            db.query(query, (err, results, fields) => {
                if (err) {
                    reject(err)
                }
                let arr = []
                for (let i = 0; i < results.length; i++) {
                    arr.push(results[i].past_responsibility)
                }
                resolve(arr)
            })
        })
    }
}

Past_Responsibility.createTable()

module.exports = Past_Responsibility