const db = require('../db')
const Users = require('./user')

class Curr_Responsibility {
    /** 
     * @param {number} name
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
        return 'curr_admin_responsibility'
    }

    /**
     * @returns {Promise<Object>}
     */
    static createTable() {
        const query = `
            CREATE TABLE ${Curr_Responsibility.tableName} (
                id int NOT NULL AUTO_INCREMENT,
                email varchar(100),
                user_id int NOT NULL,
                curr_responsibility text NOT NULL,
                PRIMARY KEY(id)
            )AUTO_INCREMENT=34000;
        `
        return db.createTable(this.tableName, query)
    }
    static getAdministration(id) {
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
            const query = `select curr_responsibility from ${this.tableName} where user_id=${userId}`
            db.query(query, (err, results, fields) => {
                if (err) {
                    reject(err)
                }
                let arr = []
                for (let i = 0; i < results.length; i++) {
                    arr.push(results[i].curr_responsibility)
                }
                resolve(arr)
            })
        })
    }

}

Curr_Responsibility.createTable()

module.exports = Curr_Responsibility