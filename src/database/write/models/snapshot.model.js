const mongoose = require('mongoose')
const Schema = mongoose.Schema


const schema = new Schema({
    eventId: { type: String, required: true },
    eventVersion: { type: Number, required: true },
    aggregateState: {
        type: Schema.Types.Mixed,
        required: true,
    },
    aggregateId: { type: String, required: true },
})




module.exports = mongoose.model('Snapshot', schema);