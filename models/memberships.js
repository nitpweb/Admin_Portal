const db = require('../db')
const Users = require('./user')

class Memberships {
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
        return 'memberships'
    }

    /**
     * @returns {Promise<Object>}
     */
    static createTable() {
        const query = `
            CREATE TABLE ${Memberships.tableName} (
                email varchar(100),
                user_id int NOT NULL,
                membership_id varchar(20) NOT NULL,
                membership_society text NOT NULL,
                PRIMARY KEY(membership_id)
            );
        `
        return db.createTable(this.tableName, query)
    }

}

Memberships.createTable()

module.exports = Memberships