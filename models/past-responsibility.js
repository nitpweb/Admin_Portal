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
                s_no int NOT NULL AUTO_INCREMENT,
                email varchar(100),
                userId int NOT NULL,
                past_responsibility text NOT NULL,
                PRIMARY KEY(s_no)
            )AUTO_INCREMENT=1;
        `
        return db.createTable(this.tableName, query)
    }

}

Past_Responsibility.createTable()

module.exports = Past_Responsibility