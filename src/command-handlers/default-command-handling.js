const InternalEventsModule = require('./internal-events')
const DataLayer = require('./data-layer')
const applyPreviousEventsToAggregate = require('./map-account-from-previous-events').accountAfterApplyingEvents
const aggregateAfterApplyingCommand = require('./account-after-command').accountAfterCommand
const events = require('events');
const eventEmitter = new events.EventEmitter();
const domainBus = require('../services/domain-bus')



async function defaultCommandHandling(command, commandName) {
    return async () => {
        const dataLayer = DataLayer(command.id)
        dataLayer.saveStateFromDb()
        const aggregateAfterPreviousEvents = applyPreviousEventsToAggregate(dataLayer.previousEvents, dataLayer.snapshot ? dataLayer.snapshot.payload : null)
        const internalEventsModule = InternalEventsModule(command.id, dataLayer.eventSequence, dataLayer.aggregateVersion)
        internalEventsModule.listenAndAddToQueueWhenEventIsFired()
        const aggregateAfterCommand = aggregateAfterApplyingCommand(aggregateAfterPreviousEvents, command, commandName)
        const newEvents = internalEventsModule.getInternalEvents()
        await dataLayer.saveCommandActionsToDb(newEvents, aggregateAfterCommand)
        newEvents.forEach(event => {
            eventEmitter.emit(`${event.name}Persisted`, event)
            domainBus.publish(event)
        })
    }
}


module.exports = defaultCommandHandling