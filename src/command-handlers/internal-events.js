const generateId = require("../services/id-generator").id;
const aggregateEntityEventEmitter = require('../entities/account').eventEmitter
const internallyDoneEvent = require('../config/events.constants').internallyDone

const internalEventsForCommand = (aggregateId, eventSequence, aggregateVersion) => ({
    eventsToBeSaved: [],
    listenAndAddToQueueWhenEventIsFired() {
        aggregateEntityEventEmitter.on(internallyDoneEvent, (eventName, payload) => {
            this.eventsToBeSaved.push({
                eventId: generateId(),
                name: eventName,
                aggregateId,
                payload,
                eventSequence: ++eventSequence,
                aggregateVersion: aggregateVersion + 1
            })
        })
    }
})


module.exports = internalEventsForCommand
