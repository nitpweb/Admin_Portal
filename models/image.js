const db = require('../db');
const User = require('./user');

class Image {
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
        return 'images'
    }

    /**
     * @returns {Promise<Object>}
     */
    static createTable() {
        const query = `
            CREATE TABLE ${this.tableName} (
                user_id int,
                email varchar(50),
                image blob,
                PRIMARY KEY(user_id),
                UNIQUE KEY(email)
            );
        `

        return db.createTable(this.tableName, query)

    }


}

Image.createTable()

module.exports = Image