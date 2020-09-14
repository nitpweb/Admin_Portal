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

    static getServiceyByUser(userId) {
        return new Promise((resolve, reject) => {
            const query = `select services from ${this.tableName} where user_id=${userId}`
            db.query(query, (err, results, fields) => {
                if (err) {
                    reject(err)
                }
                let arr = []
                for (let i = 0; i < results.length; i++) {
                    arr.push(results[i].services)
                }
                resolve(arr)
            })
        })
    }
}

Professional_Service.createTable();

module.exports = Professional_Service;