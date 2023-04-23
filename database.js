const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const init = () => {
    db.serialize(() => {
        db.run("CREATE TABLE users (userID TEXT PRIMARY KEY, name TEXT, role TEXT, password TEXT)")
        db.run("INSERT INTO users (userID, name, role, password) VALUES ('id1','user1','student','password')")
        db.run("INSERT INTO users (userID, name, role, password) VALUES ('id2','user2','student','password2')")
        db.run("INSERT INTO users (userID, name, role, password) VALUES ('id3','user3','teacher','password3')")
        db.run("INSERT INTO users (userID, name, role, password) VALUES ('admin','admin','admin','admin')")
    })}


    async function getUser(username) {
        const sql = 'SELECT * FROM users WHERE userID = $userID'
        const params = { $userID: username}
    
        return new Promise((resolve, reject) => {
            db.get(sql, params, (error, rows) => {
                if( error ) reject(error)
                else resolve(rows)
            })
        })
    }

    async function userExists(username) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM users WHERE userID = $userID `, { $userID: username }, (error, rows) => {
                if( error ) reject(error)
                else resolve(rows.length === 1)
            })
        })
    }

    module.exports = {userExists,getUser,init}