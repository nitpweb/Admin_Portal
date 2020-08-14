const db = require('../db')

/**
 * 
 * @param {class} Class 
 * @param {Object} obj 
 * @returns {Class}
 */
function typecast(Class, obj) {
    let t = new Class()
    return Object.assign(t, obj)
}

class Attachment {
    constructor(caption, url) {
        this.caption = caption
        this.url = url
    }
}

class Notice {
    /**
     * 
     * @param {number} id 
     * @param {string} title 
     * @param {Attachment[]} attach 
     * @param {number} userId
     */
    constructor(id, title, attach, userId) {
        this.id = id
        this.title = title
        this.attachments = attach
        this.timestamp = new Date().getTime()
        this.userId = userId
    }

    static get tableName() {
        return 'notices'
    }

    /**
     * @returns {Promise<Object>}
     */
    static createTable() {
        const query = `
            CREATE TABLE ${Notice.tableName} (
                id int NOT NULL,
                title varchar(50),
                timestamp bigint,
                attachments varchar(512),
                userId int NOT NULL,
                PRIMARY KEY (id)
            );
        `
        return db.createTable(this.tableName, query)
        
    }

    /**
     * 
     * @param {Notice} notice 
     */
    static create(notice) {
        const query = `
            INSERT INTO ${this.tableName} SET ?;
        `
        return new Promise((res,rej) => {
            notice.attachments = JSON.stringify(notice.attachments)
            db.query(query, notice, (err, results, fields) => {
                if(err) {
                    console.log(err)
                    rej(err)
                }
                // console.log(results)
                res(results)
            })
        })
    }

    static find(value) {
        db.find(value, this.tableName)
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Notice>}
     */
    static findById(id) {
        db.findById(id, this.tableName)
            .then(res => {
                res.attachments = JSON.parse(res.attachments)
                return typecast(Notice, res)
            })
            
    }

    save() {

    }
}

Notice.createTable()

module.exports = {Attachment, Notice}