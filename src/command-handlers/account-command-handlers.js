
// const logger = require('../Ximo/CQRS/logging-command-decorator')
const crypto = require("crypto");
const aggregateEntity = require('../entities/account')
const eventsConstants = require('../config/events.constants')
const db = require('../database/write/db-ctrl')
const events = require('events');
const aggregateAfterApplyingCommand = require('../services/account-after-command').accountAfterCommand
const aggregateAfterApplyingEvents = require('../services/account-after-events').accountAfterApplyingEvents
const eventEmitter = new events.EventEmitter();


async function handle(commandName, command) {
    let snapshot = null
    let eventsToBeAppliedToEntity = []
    let eventSequence = null
    let aggregateVersion = null
    async function init() {
        snapshot = await db.getLatestSnapShotByAggregateId(command.id)
        let nextQuery
        if (snapshot) {
            nextQuery = db.getSortedlastEventsOnly(snapshot.aggregateRootId, snapshot.lastEventSequence)
        } else {
            nextQuery = db.getSortedAllAggregateEvents(command.id)
        }
        eventsToBeAppliedToEntity = await nextQuery
        if (eventsToBeAppliedToEntity.length) {
            eventSequence = eventsToBeAppliedToEntity[eventsToBeAppliedToEntity.length - 1].eventSequence
            aggregateVersion = eventsToBeAppliedToEntity[eventsToBeAppliedToEntity.length - 1].aggregateVersion
        } else {
            eventSequence = 1
            aggregateVersion = 1
        }

    }
    await init()
    const aggregateBeforeCommandConducted = aggregateAfterApplyingEvents(eventsToBeAppliedToEntity, snapshot ? snapshot.payload : null)
    const eventsToBeSaved = []
    aggregateEntity.eventEmitter.on(eventsConstants.internallyDone, (eventName, payload) => {
        eventsToBeSaved.push({ id: crypto.randomBytes(16).toString("hex"), name: eventName, aggregateId: command.id, payload, eventSequence: ++eventSequence, aggregateVersion: aggregateVersion + 1 })
    })

    const aggregateAfterCommand = aggregateAfterApplyingCommand(aggregateBeforeCommandConducted, command, commandName)
    await db.concurrencyCheck(aggregateVersion, command.id)
    await db.saveEvents(eventsToBeSaved)
    if (eventsToBeSaved.findIndex(e => e.sequence % 10 === 0) >= 0)
        await db.saveSnapshot({ lastEventSequence: eventSequence, aggregateRootId: command.id, payload: aggregateAfterCommand })

    eventsToBeSaved.forEach(event => {
        eventEmitter.emit(`${event.name}Persisted`, event)
    })
    
}



module.exports = { handle, eventEmitter }


