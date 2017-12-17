const db = require('../../src/database/write/db-connection.js')
const app = require('../../src/app')
const request = require('supertest')
process.on('unhandledRejection', up => { throw up })


function connectToDb(){
    db.connectToTestDb()
}

function setup() {
    db.connectToTestDb()
    return [app.listen(6000), request(app)]
}


module.exports = {
    setup , connectToDb
}