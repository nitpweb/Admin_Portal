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
            id int NOT NULL AUTO_INCREMENT,
            user_id int NOT NULL,
            email varchar(250) NOT NULL,
            services text NOT NULL,
            PRIMARY KEY(id)
        )AUTO_INCREMENT=140000;
        `
        return db.createTable(this.tableName, query);
    }
    static getProfessionalService(id) {
        return new Promise((res, rej) => {
            db.find({ user_id: id }, this.tableName)
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