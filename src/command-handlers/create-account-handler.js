const InternalEventsModule = require('./internal-events')
const DataLayer = require('./data-layer')
const aggregateAfterApplyingCommand = require('./account-after-command').accountAfterCommand
const events = require('events');
const eventEmitter = new events.EventEmitter();


module.exports = {
    createAccountHandler(command, commandName) {
        return async () => {
            const dataLayer = DataLayer(command.accountId)
            await dataLayer.saveStateFromDb()
            checkForDuplication(dataLayer)
            const internalEventsModule = InternalEventsModule(command.accountId, 1, 1)
            internalEventsModule.listenAndAddToQueueWhenEventIsFired()
            const aggregateAfterCommand = aggregateAfterApplyingCommand({}, command, commandName)
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