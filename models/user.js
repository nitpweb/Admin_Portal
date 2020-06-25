const db = require('../db')

class User {
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
        this.email = email
        this.imgUrl = imgUrl
        
    }
    static get tableName() {
        return 'users'
    }

    /**
     * @returns {Promise<import('mysql').OkPacket>}
     */
    static createTable() {
        const query = `
            CREATE TABLE ${User.tableName} (
                id int NOT NULL,
                name varchar(50),
                email varchar(255),
                imgUrl varchar(512),
                PRIMARY KEY (id)
            );
        `
        
        return new Promise((res, rej) => {
            db.query(query, (err, results, fields) => {
                if(err) {
                    console.log(err)
                    rej(err)
                }
                // console.log(results)
                res(results)
            })
        })
        
    }

    /**
     * 
     * @param {number} id unique id of user
     * @returns {Promise<User>} User with id
     */
    static find(id) {
        const query = `
            SELECT * FROM ${User.tableName} WHERE id=${id};
        `
        return new Promise((resolve, reject) => {
            db.query(query, (err, results, fields) => {
                if(err) {
                    console.log(err)
                    reject(err)
                }
                // console.log(results)
                resolve(results[0])
            })
        })

        
    }

    /**
     * 
     * @param {User} user User Object
     * @returns {Promise<import('mysql').OkPacket>}
     */
    static create(user) {
        const query = `
            INSERT INTO ${User.tableName}
            VALUES (${user.id}, '${user.name}', '${user.email}', '${user.imgUrl}');
        `
        return new Promise((res,rej) => {
            db.query(query, (err, results, fields) => {
                if(err) {
                    console.log(err)
                    rej(err)
                }
                // console.log(results)
                res(results)
            })
        })

        
    }

    /**
     * updates current user data to SQL database
     * @returns {Promise<import('mysql').OkPacket>}
     */
    save() {
        const query = `
            UPDATE ${User.tableName}
            SET name = '${user.name}', email = '${user.email}', imgUrl = '${user.imgUrl}'
            WHERE id = ${this.id};
        `
        return new Promise((res,rej) => {
            db.query(query, (err, results, fields) => {
                if(err) {
                    console.log(err)
                    rej(err)
                }
                // console.log(results)
                res(results)
            })
        })
    }

}

module.exports = User