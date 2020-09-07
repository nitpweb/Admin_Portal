const db = require('../db');

class User {
    /**
     * 
     * @param {number} id unique id
     * @param {string} name varchar(50)
     * @param {string} email 
     * @param {string} imgUrl 
     */
    constructor(name, email, imgUrl) {

        this.name = name;
        this.email = email || ''
        this.imgUrl = imgUrl || ''

    }
    /**
     * 
     */
    static get tableName() {
        return 'users'
    }

    static get ADMIN() {
        return 1
    }
    static get HOD() {
        return 2
    }
    static get FACULTY() {
        return 3
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
    static getUser(id) {
        return new Promise((res, rej) => {
            db.find({ id: id }, this.tableName)
                .then(results => {
                    if(results.length == 1) {
                        res(results[0])
                    }
                    else {
                        rej("No User or Duplicate found")
                    }
                })
                .catch(err => {
                    rej(err)
                });
        });
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
        if (user.id) {
            delete user.id
        }
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
     * @returns {Promise<Array<User>>}
     */
    static getAllUsers() {
        // return new Promise((resolve, reject) => {
        //     const query = `
        //         select * from ${this.tableName} 
        //     `


        // })
        return db.find({}, this.tableName)

    }

    /**
     * Converts Javascript object to User object
     * @param {Object} object valid javascript object
     * @returns {User} 
     */
    static parse(object) {
        const { id, name, email, imgUrl } = object
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