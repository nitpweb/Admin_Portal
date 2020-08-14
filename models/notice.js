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
    constructor(title, attach, userId, openDate, closeDate, important) {
        let now = new Date().getTime();
        this.id = now
        this.title = title
        this.attachments = attach
        this.timestamp = now
        this.userId = userId
        this.openDate = openDate
        this.closeDate = closeDate
        this.important = important
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
                id bigint NOT NULL,
                title varchar(50),
                timestamp bigint,
                openDate bigint,
                closeDate bigint,
                important int,
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
        return db.find(value, this.tableName)
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Notice>}
     */
    static findById(id) {
        return db.findById(id, this.tableName)
            .then(res => {
                res.attachments = JSON.parse(res.attachments)
                return typecast(Notice, res)
            })
            
    }

    static updateAttachments(id, caption, link){
        db.getAttachments(id, caption, link);
    }

    save() {

    }
}

Notice.createTable()

module.exports = {Attachment, Notice}