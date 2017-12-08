const db = require('../../src/core/dbConnection.js')


function connectToDb(){
    db.connectToTestDb()
}
module.exports = {
     connectToDb
}