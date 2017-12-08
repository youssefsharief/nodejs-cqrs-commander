
const mongoose = require("mongoose")
mongoose.Promise = global.Promise;

function connectToOriginalDb(){
    return mongoose.connect(process.env.mongodbEventStoreURI, { useMongoClient: true});
}
function connectToTestDb(){
    return mongoose.connect(process.env.mongodbEventStoreTestURI, { useMongoClient: true});
}




mongoose.connection.on('open', () => console.log('Db connected'))

mongoose.connection.on('error', (error) => {
    throw new Error(error)
})
module.exports  = {connectToOriginalDb, connectToTestDb}


