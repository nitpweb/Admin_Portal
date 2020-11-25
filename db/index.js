const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: "utf8",
});

connection.on('error', function(err) {
        console.log(err.code)
    })
    .on('connect', function() {
        console.log('db connection established')
    })

/**
 * 
 * @param {number} id unique id of row
 * @param {string} tableName valid name of table
 */
connection.findById = (id, tableName) => {

    const query = `
        SELECT * FROM ${tableName} WHERE id = ${id};
    `
    return new Promise((resolve, reject) => {
        if (!tableName) {
            reject('Table Name is Not valid')
        }
        connection.query(query, (err, results, fields) => {
            if (err) {
                console.log(err)
                reject(err)
            }
            // console.log(results)
            if (results.length == 0) {
                reject("id does not exist")
            } else {
                resolve(results[0])
            }

        })
    })
}

/**
 * 
 * @param {Object} value column name as key and target value as value of key
 * @param {string} tableName 
 */
connection.find = (value, tableName) => {

    return new Promise((resolve, reject) => {
        if (!tableName) {
            reject('Table Name is Not valid')
        }
        let query = `
            SELECT * FROM ${tableName} WHERE ?;
        `
        if (Object.keys(value).length == 0) {
            query = `SELECT * FROM ${tableName};`
        }
        connection.query(query, value, (err, results, fields) => {
            if (err) {
                console.log(err)
                reject(err)
            }
            // console.log(results)
            if (results.length == 0) {
                resolve(null)
            } else {
                resolve(results)
            }

        })
    })
}

/**
 * 
 * @param {string} id / for id reference to row 
 * @param {bigint} idvalue / for 
 */

connection.update = (id, idvalue, datatoset, field, tableName) => {

    return new Promise((resolve, reject) => {
        if (!tableName) {
            reject('Table Name is Not valid')
        }
        let query = `UPDATE ${tableName} SET ${field} = ${datatoset} WHERE ${id} = ${idvalue}`;
        connection.query(query, function(err, result) {
            if (err) {
                console.log(err);
                reject(err)
            };
            console.log(result.affectedRows + " record(s) updated");
            resolve(result)
        });
    })

}


connection.updateWholeObj = (id, idvalue, notice, tableName) => {

    return new Promise((resolve, reject) => {
        if (!tableName) {
            reject('Table Name is Not valid')
        }
        let query = `UPDATE ${tableName} SET ? WHERE ${id} = ${idvalue}`;
        notice.attachments = JSON.stringify(notice.attachments)
        connection.query(query, notice, function(err, result) {
            if (err) {
                console.log(err);
                reject(err)
            };
            console.log(result.affectedRows + " record(s) updated");
            resolve(result)
        });
    })

}


/**
 * Creates table only if it doesn't exist otherwise nothing
 * @param {string} name name of table to be created
 * @param {string} query sql query to create desired table
 */
connection.createTable = function(name, query) {
    return new Promise((resolve, reject) => {
        connection.query(`show tables like '${name}'`, function(err, results, fields) {
            if (err) {
                console.log(err)
                reject(err)
            }
            // console.log(results)
            if (results.length == 0) {
                // create table
                connection.query(query, (err, results, fields) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    console.log(`Table ${name} created`)
                    resolve({
                        msg: 'Table Created'
                    })
                })
            } else {
                resolve({
                    msg: 'Table Already Exist'
                })
            }
        })
    })

}


module.exports = connection