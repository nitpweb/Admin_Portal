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
                title varchar(1000),
                timestamp bigint,
                openDate bigint,
                closeDate bigint,
                important int,
                attachments varchar(1000),
                userId varchar(35) NOT NULL,
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

    static findByUserID(userid){
        return db.findByUserID(userid)
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

    static toggleVisibility(id) {
        let query = `SELECT closeDate, timestamp FROM ${this.tableName} WHERE id = ${id}`
        return db.query(query, function(err, notices){
            if(err){
                console.log(err);
                return;
            }
            db.update("id", id, notices[0].timestamp, "closeDate", this.tableName)
            db.update("id", id, notices[0].closeDate, "timestamp", this.tableName)
        })
    }

    static toggleImportance(id, value) {
        console.log(this.tableName)
        return db.update("id", id, value, "important", this.tableName);
    }
}

Notice.createTable()

module.exports = {Attachment, Notice}