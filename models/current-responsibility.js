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
                s_no int NOT NULL AUTO_INCREMENT,
                email varchar(100),
                userId int NOT NULL,
                curr_responsibility text NOT NULL,
                PRIMARY KEY(s_no)
            )AUTO_INCREMENT=1;
        `
        return db.createTable(this.tableName, query)
    }
    static getAdministration(email){
        return new Promise((res,rej) =>{
            db.find({email: email}, this.tableName)
            .then(results => {
                res(results)
            })
            .catch(err =>{
                rej(err)
            });
        });
    }

}

Curr_Responsibility.createTable()

module.exports = Curr_Responsibility