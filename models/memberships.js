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
                id int NOT NULL AUTO_INCREMENT,
                email varchar(100),
                user_id int NOT NULL,
                membership_id varchar(20) NOT NULL,
                membership_society text NOT NULL,
                PRIMARY KEY(id)
            )AUTO_INCREMENT=90000;
        `
        return db.createTable(this.tableName, query)
    }

    static getMemberships(id) {
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

    static getMembershipsByUser(userId) {
        return new Promise((resolve, reject) => {
            const query = `select membership_id,membership_society from ${this.tableName} where user_id=${userId}`
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

Memberships.createTable()

module.exports = Memberships