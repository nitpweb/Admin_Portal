const db = require('../db')

class Professional_Service {
    constructor() {

    }

    static get tableName() {
        return 'Professional_Service';
    }

    static createTable() {
        const query = `
        CREATE TABLE ${Professional_Service.tableName} (
            s_no int NOT NULL AUTO_INCREMENT,
            userId int NOT NULL,
            emailId varchar(250) NOT NULL,
            services text NOT NULL,
            PRIMARY KEY(s_no)
        )AUTO_INCREMENT=1;
        `
        return db.createTable(this.tableName, query);
    }
    static getProfessionalService(email) {
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

Professional_Service.createTable();

module.exports = Professional_Service;