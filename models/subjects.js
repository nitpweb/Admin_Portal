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
                s_no int NOT NULL AUTO_INCREMENT,
                email varchar(100),
                userId int NOT NULL,
                subject text NOT NULL,
                PRIMARY KEY(s_no)
            )AUTO_INCREMENT=1;
        `
        return db.createTable(this.tableName, query)
    }

}

Subjects.createTable()

module.exports = Subjects