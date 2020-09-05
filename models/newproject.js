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
            id int NOT NULL AUTO_INCREMENT,
            user_id int NOT NULL,
            email varchar(250) NOT NULL,
            project text NOT NULL,
            PRIMARY KEY(id)
        )AUTO_INCREMENT=80000;
        `
        return db.createTable(this.tableName, query);
    }
    static getProjects(id) {
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

Project.createTable();

module.exports = Project;