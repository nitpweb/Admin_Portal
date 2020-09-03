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
            s_no int NOT NULL AUTO_INCREMENT,
            userId int NOT NULL,
            emailId varchar(250) NOT NULL,
            work_experiences text NOT NULL,
            PRIMARY KEY(s_no)
        )AUTO_INCREMENT=1;
        `
        return db.createTable(this.tableName, query);
    }
    static getWorkExperience(email) {
        return new Promise((res, rej) => {
            db.find({ emailId: email }, this.tableName)
                .then(results => {
                    res(results)
                })
                .catch(err => {
                    rej(err)
                })
        })
    }
}

Workexpreience.createTable();

module.exports = Workexpreience;