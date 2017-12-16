const mongoose = require('mongoose')
const Schema = mongoose.Schema


const schema = new Schema({
    eventId:String,
    name: {
        type: String,
        required: true
    },
    aggregateId: {
        type: String,
        required: true,
    },
    payload: {
        type: Schema.Types.Mixed,
        required: true,
    },
    eventSequence: {type: Number, required: false},
    CreatedOnUtc: { type: Date, default: Date.now, required: true },
    aggregateVersion: {type: Number, required: true}
})


module.exports = mongoose.model('Event', schema);
