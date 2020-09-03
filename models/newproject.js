const db = require('../db')

class Project {
    constructor() {

    }

    static get tableName() {
        return 'Project';
    }

    static createTable() {
        const query = `
        CREATE TABLE ${Project.tableName} (
            s_no int NOT NULL AUTO_INCREMENT,
            userId int NOT NULL,
            emailId varchar(250) NOT NULL,
            project text NOT NULL,
            PRIMARY KEY(s_no)
        )AUTO_INCREMENT=1;
        `
        return db.createTable(this.tableName, query);
    }
    static getProjects(email) {
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

Project.createTable();

module.exports = Project;