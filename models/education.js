const db = require('../db')
const Users = require('./user')

class Education {
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
        return 'education'
    }

    /**
     * @returns {Promise<Object>}
     */
    static createTable() {
        const query = `
            CREATE TABLE ${Education.tableName} (
                s_no int NOT NULL AUTO_INCREMENT,
                email varchar(100),
                user_id int NOT NULL,
                certification varchar(10) NOT NULL,
                institution text NOT NULL,
                passing_year varchar(10) DEFAULT NULL,
                PRIMARY KEY(s_no)
            )AUTO_INCREMENT=1;
        `
        return db.createTable(this.tableName, query)
    }
    static getQualification(email){
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

Education.createTable()

module.exports = Education