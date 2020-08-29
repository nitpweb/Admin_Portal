const db = require('../db');


class newProf {
    /**
     * 
     * @param {number} id unique id
     * @param {string} email 
     */
    constructor(id, name, email, imgUrl) {
        this.id = id;
        this.email = email || ''
    }
    /**
     * @private 
     */
    static get tableName() {
        return 'users'
    }

    /**
     * @returns {Promise<Object>}
     */
    static createTable() {
        const query = `
            CREATE TABLE ${User.tableName} (
                id int NOT NULL,
                email varchar(255),
                PRIMARY KEY (id)
            );
        `

        return db.createTable(this.tableName, query)

    }

    /**
     * 
     * @param {User} user User Object
     * @returns {Promise<import('mysql').OkPacket>}
     */
    static create(user) {
        const query = `
            INSERT INTO ${User.tableName} SET ?;
        `
        return new Promise((res, rej) => {
            db.query(query, user, (err, results, fields) => {
                if (err) {
                    console.log(err)
                    rej(err)
                }
                // console.log(results)
                res(results)
            })
        })


    }

    /**
     * Converts Javascript object to User object
     * @param {Object} object valid javascript object
     * @returns {User} 
     */
    static parse(object) {
        const {
            id,
            email
        } = object
        return new User(id, email)
    }

    /**
     * updates current user data to SQL database
     * @returns {Promise<import('mysql').OkPacket>}
     */
    save() {
        const query = `
            UPDATE ${User.tableName}
            SET name = '${this.name}', email = '${this.email}', imgUrl = '${this.imgUrl}'
            WHERE id = ${this.id};
        `
        return new Promise((res, rej) => {
            db.query(query, (err, results, fields) => {
                if (err) {
                    console.log(err)
                    rej(err)
                }
                // console.log(results)
                res(results)
            })
        })
    }

}

User.createTable()

module.exports = User