const InternalEventsModule = require('./internal-events')
const DataLayer = require('./data-layer')
const replayOldEvents = require('./map-account-from-previous-events').accountAfterApplyingEvents
const aggregateAfterApplyingCommand = require('./account-after-command').accountAfterCommand
const events = require('events');
const eventEmitter = new events.EventEmitter();


module.exports = {
    createAccountHandler(command, commandName) {
        return async () => {
            const dataLayer = DataLayer(command.id)
            await dataLayer.saveStateFromDb()
            checkForDuplication(dataLayer)
            const aggregatAfterReplay = replayOldEvents(dataLayer.previousEvents, dataLayer.snapshot ? dataLayer.snapshot.payload : null)
            const internalEventsModule = InternalEventsModule(command.id, dataLayer.eventSequence, dataLayer.aggregateVersion)
            internalEventsModule.listenAndAddToQueueWhenEventIsFired()
            const aggregateAfterCommand = aggregateAfterApplyingCommand(aggregatAfterReplay, command, commandName)
            await dataLayer.saveCommandActionsToDb(internalEventsModule.eventsToBeSaved, aggregateAfterCommand)
            internalEventsModule.eventsToBeSaved.forEach(event => {
                eventEmitter.emit(`${event.name}Persisted`, event)
            })
        }
    }
}

function checkForDuplication(dataLayer) {
    if ((dataLayer.snapshot && dataLayer.snapshot.payload) || (dataLayer.previousEvents.find(x => x.name === 'accountCreated')))
        throw Error('This account has been created before')
}