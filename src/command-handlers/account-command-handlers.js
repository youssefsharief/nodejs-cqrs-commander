
// const logger = require('../Ximo/CQRS/logging-command-decorator')
const crypto = require("crypto");
const reduce = require('../reducers/account-reducer')
const accountEntity = require('../entities/account')
const eventsConstants = require('../config/events.constants')
const db = require('../database/write/db-ctrl')


async function handle(commandName, command ) {
    let snapshot = null
    let eventsToBeAppliedToEntity = []
    let eventSequence = null
    let aggregateVersion = null
    async function init() {
        snapshot = await db.getLatestSnapShotByAggregateId(command.id)
        let nextQuery
        if (snapshot) {
            nextQuery = db.getSortedAggregateEventsAfterSnaphot(snapshot)
        } else {
            nextQuery = db.getSortedAllAggregateEvents(command.id)
        }
        eventsToBeAppliedToEntity = await nextQuery
        eventSequence = eventsToBeAppliedToEntity[eventsToBeAppliedToEntity.length - 1].eventSequence
        aggregateVersion = eventsToBeAppliedToEntity[eventsToBeAppliedToEntity.length - 1].aggregateVersion
    }
    function getCurrentAggregateStateFromDbAndReducer() {
        return reduce(eventsToBeAppliedToEntity, snapshot.aggregateState)
    }
    await init()
    const accountBeforeCommandConducted = getCurrentAggregateStateFromDbAndReducer(command.id)
    const accountAggregateAfterPerformingCommand = accountEntity.fn(accountBeforeCommandConducted)
    const eventsToBeSaved = []
    accountEntity.eventEmitter.on(eventsConstants.internallyDone, (eventName, payload) => {
        eventsToBeSaved.push({ id: crypto.randomBytes(16).toString("hex"), name: eventName, aggregateId: command.id, payload, eventSequence: ++eventSequence, aggregateVersion: aggregateVersion + 1 })
    })
    await db.concurrencyCheck(aggregateVersion, command.id)
    await db.save(eventsToBeSaved)
    if (eventsToBeSaved.findIndex(e => e.sequence % 10 === 0) >= 0)
        await db.saveSnapshot({ eventId: eventsToBeSaved[eventsToBeSaved.length - 1].id, eventVersion: eventSequence, aggregateId: command.id, aggregateState: accountAggregateAfterPerformingCommand })

}



module.exports = { handle}


