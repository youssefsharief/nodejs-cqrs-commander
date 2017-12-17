const InternalEventsModule = require('./internal-events')
const DataLayer = require('./data-layer')
const replayOldEvents = require('./map-account-from-previous-events').accountAfterApplyingEvents
const aggregateAfterApplyingCommand = require('./account-after-command').accountAfterCommand


async function defaultCommandHandling(command, commandName) {
    const dataLayer = DataLayer(command.accountId)
    await dataLayer.saveStateFromDb()
    ensureAggregateHasBeenCreatedBefore(dataLayer)
    const aggregatAfterReplay = replayOldEvents(dataLayer.previousEvents, dataLayer.snapshot ? dataLayer.snapshot.payload : null)
    const internalEventsModule = InternalEventsModule(command.accountId, dataLayer.eventSequence, dataLayer.aggregateVersion)
    internalEventsModule.listenAndAddToQueueWhenEventIsFired()
    const aggregateAfterCommand = aggregateAfterApplyingCommand(aggregatAfterReplay, command, commandName)
    return await dataLayer.saveCommandActionsToDb(internalEventsModule.eventsToBeSaved, aggregateAfterCommand)
}


module.exports = defaultCommandHandling

function ensureAggregateHasBeenCreatedBefore(dataLayer) {
    if ((!dataLayer.snapshot || !dataLayer.snapshot.payload) && (!dataLayer.previousEvents.find(x => x.name === 'accountCreated')))
        throw Error('You could not perform this action on a non existing account')
}