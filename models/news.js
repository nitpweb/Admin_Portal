const db = require("../db");

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

class News {
  /**
   *
   * @param {number} id
   * @param {string} title
   * @param {Attachment[]} attach
   * @param {number} userId
   */

  constructor(id, title, attach, userId, openDate, closeDate, venue, description) {
    let now = new Date().getTime();
    this.id = id;
    this.title = title;
    this.attachments = attach;
    this.timestamp = now;
    this.userId = userId;
    this.openDate = openDate;
    this.closeDate = closeDate;
    this.venue = venue;
    this.description = description;
  }

  static get tableName() {
    return "news";
  }

  /**
   * @returns {Promise<Object>}
   */
  static createTable() {
    const query = `
            CREATE TABLE ${News.tableName} (
                id bigint NOT NULL,
                title varchar(1000),
                timestamp bigint,
                openDate bigint,
                closeDate bigint,
                venue varchar(1000),
                description varchar(1000),
                attachments varchar(1000),
                userId varchar(35) NOT NULL,
                PRIMARY KEY (id)
            );
        `;
    return db.createTable(this.tableName, query);
  }

  /**
   *
   * @param {Newss} news
   */
  static create(news) {
    const query = `
            INSERT INTO ${this.tableName} SET ?;
        `;
    return new Promise((res, rej) => {
      news.attachments = JSON.stringify(news.attachments);
      db.query(query, news, (err, results, fields) => {
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
   * @returns {Promise<Newss>}
   */
  static findById(id) {
    return db.findById(id, this.tableName).then((res) => {
      res.attachments = JSON.parse(res.attachments);
      return typecast(News, res);
    });
  }

  static updateAttachments(id, caption, link) {
    db.getAttachments(id, caption, link);
  }

  save() {}

  static updateData(id, key, value) {
    return db.update("id", id, value, key, this.tableName);
  }

  static updateWholeObj(id, news) {
    return db.updateWholeObj("id", id, news, this.tableName);
  }

  static toggleVisibility(id, visible_status) {
    let query = `SELECT closeDate, timestamp FROM ${this.tableName} WHERE id = ${id}`;
    return db.query(query, function (err, news) {
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
          "newss"
        );
      } else {
        db.update("id", id, news[0].timestamp, "closeDate", "newss");
      }
    });
  }

  static toggleImportance(id, value) {
    console.log(this.tableName);
    return db.update("id", id, value, "important", this.tableName);
  }

  static deleteRow(id) {
    let query = `DELETE FROM ${this.tableName} WHERE id = ${id}`;
    return db.query(query, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Number of records deleted: " + result.affectedRows);
    });
  }

  static getActiveNews() {
    return new Promise((resolve, reject) => {
      const now = new Date().getTime();
      const query = `
                select id,title,timestamp,openDate,closeDate,venue,description,attachments from ${this.tableName} 
                where closeDate>${now};
            `;
      db.query(query, (err, results, fields) => {
        if (err) reject(err);
        console.log(fields);
        results.forEach((news) => {
          news.attachments = JSON.parse(news.attachments);
        });
        resolve(results);
      });
    });
  }

  static getArchivedNews() {
    return new Promise((resolve, reject) => {
      const now = new Date().getTime();
      const query = `
                select id,title,timestamp,openDate,closeDate,venue,description,attachments from ${this.tableName} 
                where closeDate<${now};
            `;
      db.query(query, (err, results, fields) => {
        if (err) reject(err);
        console.log(fields);
        results.forEach((news) => {
          news.attachments = JSON.parse(news.attachments);
        });
        resolve(results);
      });
    });
  }
}

News.createTable();

module.exports = { Attachment, News };
