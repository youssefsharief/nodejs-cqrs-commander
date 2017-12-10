const mongoose = require('mongoose')
const Schema = mongoose.Schema


const schema = new Schema({
    lastEventSequence: { type: Number, required: true },
    payload: {
        type: Schema.Types.Mixed,
        required: true,
    },
    aggregateRootId: { type: String, required: true },
    
})




module.exports = mongoose.model('Snapshot', schema);