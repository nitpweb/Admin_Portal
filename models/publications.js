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
                publication_id varchar(100),
                PRIMARY KEY(publication_id),
                UNIQUE KEY(email)
            );
        `
        return db.createTable(this.tableName, query)
    }
}
Publications.createTable()

module.exports = Publications