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
            id int NOT NULL AUTO_INCREMENT,
            userId int NOT NULL,
            email varchar(250) NOT NULL,
            work_experiences text NOT NULL,
            PRIMARY KEY(id)
        )AUTO_INCREMENT=60000;
        `
        return db.createTable(this.tableName, query);
    }
    static getWorkExperience(email) {
        return new Promise((res, rej) => {
            db.find({ email: email }, this.tableName)
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