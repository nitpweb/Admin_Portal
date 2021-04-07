const db = require("../db");
const Image = require("./image");
// Image
/**
 *
 * @param {class} Class
 * @param {Object} obj
 * @returns {Class}
 */
function typecast(Class, obj) {
  let t = new Class();
  return Object.assign(t, obj);
}

class Attachment {
  constructor(caption, url) {
    this.caption = caption;
    this.url = url;
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

  constructor(id, title, attach, userId, openDate, closeDate, important) {
    let now = new Date().getTime();
    this.id = id;
    this.title = title;
    this.attachments = attach;
    this.timestamp = now;
    this.userId = userId;
    this.openDate = openDate;
    this.closeDate = closeDate;
    this.important = important;
  }

  static get tableName() {
    return "notices";
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
        `;
    return db.createTable(this.tableName, query);
  }

  /**
   *
   * @param {Notice} notice
   */
  static create(notice) {
    const query = `
            INSERT INTO ${this.tableName} SET ?;
        `;
    return new Promise((res, rej) => {
      notice.attachments = JSON.stringify(notice.attachments);
      db.query(query, notice, (err, results, fields) => {
        if (err) {
          console.log(err);
          rej(err);
        }
        // console.log(results)
        res(results);
      });
    });
  }

  static findByUserID(userid) {
    return db.findByUserID(userid);
  }

  /**
   *
   * @param {number} id
   * @returns {Promise<Notice>}
   */
  static findById(id) {
    return db.findById(id, this.tableName).then((res) => {
      res.attachments = JSON.parse(res.attachments);
      return typecast(Notice, res);
    });
  }

  static updateAttachments(id, caption, link) {
    db.getAttachments(id, caption, link);
  }

  save() {}

  static updateData(id, key, value) {
    return db.update("id", id, value, key, "notices");
  }

  static updateWholeObj(id, notice) {
    return db.updateWholeObj("id", id, notice, "notices");
  }

  static toggleVisibility(id, visible_status) {
    let query = `SELECT closeDate, timestamp FROM notices WHERE id = ${id}`;
    return db.query(query, function (err, notices) {
      if (err) {
        console.log(err);
        return;
      }
      if (visible_status == 1) {
        db.update(
          "id",
          id,
          new Date().getTime() + 86400000 * 5,
          "closeDate",
          "notices"
        );
      } else {
        db.update("id", id, notices[0].timestamp, "closeDate", "notices");
      }
    });
  }

  static toggleImportance(id, value) {
    console.log(this.tableName);
    return db.update("id", id, value, "important", this.tableName);
  }

  static deleteRow(id) {
    let query = `DELETE FROM notices WHERE id = ${id}`;
    return db.query(query, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Number of records deleted: " + result.affectedRows);
    });
  }

  static getActiveNotices() {
    return new Promise((resolve, reject) => {
      const now = new Date().getTime();
      const query = `
                select id,title,timestamp,attachments from ${this.tableName} 
                where openDate<${now} AND closeDate>${now};
            `;
      db.query(query, (err, results, fields) => {
        if (err) reject(err);
        console.log(fields);
        results.forEach((notice) => {
          notice.attachments = JSON.parse(notice.attachments);
        });
        resolve(results);
      });
    });
  }

  static getArchivedNotices() {
    return new Promise((resolve, reject) => {
      const now = new Date().getTime();
      const query = `
                select id,title,timestamp,attachments from ${this.tableName} 
                where closeDate<${now};
            `;
      db.query(query, (err, results, fields) => {
        if (err) reject(err);
        console.log(fields);
        results.forEach((notice) => {
          notice.attachments = JSON.parse(notice.attachments);
        });
        resolve(results);
      });
    });
  }
}

Notice.createTable();

module.exports = { Attachment, Notice };
