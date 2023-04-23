const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const init = () => {
    db.serialize(() => {
        db.run("CREATE TABLE Users (userID TEXT PRIMARY KEY, name TEXT, role TEXT, password TEXT)")
        db.run("INSERT INTO Users (userID, name, role, password) VALUES ('id1','user1','student','password')")
        db.run("INSERT INTO Users (userID, name, role, password) VALUES ('id2','user2','student','password2')")
        db.run("INSERT INTO Users (userID, name, role, password) VALUES ('id3','user3','teacher','password3')")
        db.run("INSERT INTO Users (userID, name, role, password) VALUES ('admin','admin','admin','admin')")
    })}


    async function getUser(username) {
        const sql = 'SELECT * FROM Users WHERE userID = $userID'
        const params = { $username: username}
    
        return new Promise((resolve, reject) => {
            db.get(sql, params, (error, rows) => {
                if( error ) reject(error)
                else resolve(rows)
            })
        })
    }

    module.exports = {getUser,init}