
// const logger = require('../Ximo/CQRS/logging-command-decorator')
const crypto = require("crypto");
const reduce = require('../reducers/account-reducer')
const accountEntity = require('../entities/account')
const eventsConstants = require('../config/events.constants')
const commandFunctionMapper = require('../services/command-function-mapper')
const db = require('../database/write/db-ctrl')
const events = require('events');
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
        eventSequence = eventsToBeAppliedToEntity[eventsToBeAppliedToEntity.length - 1].eventSequence
        aggregateVersion = eventsToBeAppliedToEntity[eventsToBeAppliedToEntity.length - 1].aggregateVersion
    }
    function getCurrentAggregateStateFromDbAndReducer() {
        return reduce(eventsToBeAppliedToEntity, snapshot.payload)
    }
    await init()
    const accountBeforeCommandConducted = getCurrentAggregateStateFromDbAndReducer(command.id)
    const accountAggregateAfterPerformingCommand = commandFunctionMapper.get(commandName)(accountBeforeCommandConducted)
    const eventsToBeSaved = []
    accountEntity.eventEmitter.on(eventsConstants.internallyDone, (eventName, payload) => {
        eventsToBeSaved.push({ id: crypto.randomBytes(16).toString("hex"), name: eventName, aggregateId: command.id, payload, eventSequence: ++eventSequence, aggregateVersion: aggregateVersion + 1 })
    })
    await db.concurrencyCheck(aggregateVersion, command.id)
    await db.saveEvents(eventsToBeSaved)
    if (eventsToBeSaved.findIndex(e => e.sequence % 10 === 0) >= 0)
        await db.saveSnapshot({ lastEventSequence: eventSequence, aggregateRootId: command.id, payload: accountAggregateAfterPerformingCommand })

    eventsToBeSaved.forEach(event => {
        eventEmitter.emit(`${event.name}Persisted`, event)
    })

}



module.exports = { handle, eventEmitter }


