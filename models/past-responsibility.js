const db = require('../db')
const Users = require('./user')

class Past_Responsibility {
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
}

Past_Responsibility.createTable()

module.exports = Past_Responsibility