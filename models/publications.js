const db = require('../db');

class Publications {
    /**
     * 
     * @param {number} id unique id
     * @param {string} name varchar(50)
     * @param {string} email 
     * @param {string} imgUrl 
     */
    constructor(id, name, email, imgUrl) {
        this.id = id;
        this.name = name;
        this.email = email || ''
        this.imgUrl = imgUrl || ''

    }
    /**
     * @private 
     */
    static get tableName() {
        return 'publications'
    }

    /**
     * @returns {Promise<Object>}
     */
    static createTable() {
        const query = `
            CREATE TABLE ${this.tableName}(
                user_id int,
                email varchar(50),
                publication_id int NOT NULL AUTO_INCREMENT,
                publications text NOT NULL,
                PRIMARY KEY(publication_id),
                UNIQUE KEY(email)
            )AUTO_INCREMENT=160000;
        `
        return db.createTable(this.tableName, query)
    }

    static getFileData(email) {
        return new Promise((res, rej) => {
            db.find({ email: email }, this.tableName)
                .then(results => {
                    if (results) {
                        const fileData = results[0].publications
                        res(fileData)
                    } else {
                        res(null)
                    }
                })
                .catch(err => {
                    rej(err)
                })
        })
    }
}
Publications.createTable()

module.exports = Publications