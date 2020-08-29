const db = require('../db');


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
        this.email = email || ''
        this.imgUrl = imgUrl || ''
        
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
                id int NOT NULL AUTO_INCREMENT,
                name varchar(50),
                email varchar(100),
                role int(1),
                imgUrl varchar(512),
                image blob,
                department varchar(100),
                designation varchar(100),
                ext_no int(4),
                research_interest text,
                PRIMARY KEY (id),
                UNIQUE KEY (email)
            )AUTO_INCREMENT=1000;
        `
        
        return db.createTable(this.tableName, query)
        
    }

    /**
     * 
     * @param {number} id unique id of user
     * @returns {Promise<User>} User with id
     */
    static findById(id) {

        // const query = `
        //     SELECT * FROM ${User.tableName} WHERE id=${id};
        // `
        // return new Promise((resolve, reject) => {
        //     db.query(query, (err, results, fields) => {
        //         if(err) {
        //             console.log(err)
        //             reject(err)
        //         }
        //         // console.log(results)
        //         if(results.length == 0){
        //             reject("User does not exist")
        //         }
        //         else {
        //             resolve(User.parse(results[0]))
        //         }
                
        //     })
        // })

        return db.findById(id, User.tableName)
            .then(res => User.parse(res))
            .catch(err => {
                throw err
            })

        
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
        return new Promise((res,rej) => {
            db.query(query, user, (err, results, fields) => {
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
     * Converts Javascript object to User object
     * @param {Object} object valid javascript object
     * @returns {User} 
     */
    static parse(object) {
        const {id, name, email, imgUrl} = object
        return new User(id, name, email, imgUrl)
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

User.createTable()

module.exports = User