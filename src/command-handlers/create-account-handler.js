const InternalEventsModule = require('./internal-events')
const DataLayer = require('./data-layer')
const aggregateAfterApplyingCommand = require('./account-after-command').accountAfterCommand


module.exports = {
    async createAccountHandler(command, commandName) {
        const dataLayer = DataLayer(command.accountId)
        await dataLayer.saveStateFromDb()
        checkForDuplication(dataLayer)
        const internalEventsModule = InternalEventsModule(command.accountId, 1, 1)
        internalEventsModule.listenAndAddToQueueWhenEventIsFired()
        const aggregateAfterCommand = aggregateAfterApplyingCommand({}, command, commandName)
        return await dataLayer.saveCommandActionsToDb(internalEventsModule.eventsToBeSaved, aggregateAfterCommand)
    }
}

function checkForDuplication(dataLayer) {
    if ((dataLayer.snapshot && dataLayer.snapshot.payload) || (dataLayer.previousEvents.find(x => x.name === 'accountCreated')))
        throw Error('This account has been created before')
}