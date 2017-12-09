// name: {
//   type: String,
//   required: true
// },
// aggregateId: {
//   type: String,
//   required: true,
// },
// payload: {
//   type: Schema.Types.Mixed,
//   required: true,
// },
// eventSequence: {type: Number, required: false},
// CreatedOnUtc: { type: Date, default: Date.now, required: true },
// AggregateVersion: {type: Number, required: true}

const crypto = require("crypto");
const eventModel = require('./database/write/models/event.model')

function addEvent(eventName,aggregateId, payload, eventSequence,aggregateVersion) {
    const a = eventModel({
        name: eventName,
        aggregateId,
        payload,
        eventSequence,
        aggregateVersion,
    })
    return a.save().then(x => console.log(x)).catch(err => console.log(err.message))
}
const payload = {
    accountId: '12345',
    businessName: 'fdg',
    accountId: crypto.randomBytes(16).toString("hex")
}
addEvent('accountCreated', 'dasdasds', payload, 5,2 )


// 184a031d05a6fcebf6dc5c7eb2e4d0a2