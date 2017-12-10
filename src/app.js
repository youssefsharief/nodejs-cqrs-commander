
const constants = require('./config/commands.constants')
const bus = require('./messaging/receive-commands')
const logger = require('../Ximo/CQRS/logging-command-decorator')
const { approveAccountHandler, createAccountHandler, deleteAccountHandler,
    reinstateAccountHandler, updateAccountAdderssHandler } = require('./command-handlers/account-command-handlers')

const reduce = require('./reducers/account-reducer')
const accountEntity = require('./entities/account')
const eventsConstants = require('./config/events.constants')
const { validateApproveInput } = require('./entities/validation/account-validation')
const db = require('./database/write/db.ctrl')

bus.pollQueueForMessages()

bus.eventEmitter.on(constants.approveAccount, async command => {
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
    const accountAggregateAfterPerformingCommand = accountEntity.approve(accountBeforeCommandConducted, validateApproveInput(command.approvedBy))
    const eventsToBeSaved = []
    accountEntity.eventEmitter.on(eventsConstants.internallyDone, (eventName, payload) => {
        eventsToBeSaved.push({ id: ,name: eventName, aggregateId: command.id, payload, eventSequence: ++eventSequence, aggregateVersion: aggregateVersion + 1 })
    })
    await db.concurrencyCheck(aggregateVersion, command.id)
    await db.save(eventsToBeSaved)
    if (eventsToBeSaved.findIndex(e => e.sequence % 10 === 0) >= 0)
        await db.saveSnapshot({ eventId: eee, eventVersion: eventSequence, aggregateId: command.id, aggregateState: accountAggregateAfterPerformingCommand })

    logger(approveAccountHandler, constants.approveAccount, command)
})

bus.eventEmitter.on(constants.deleteAccount, command => {
    logger(deleteAccountHandler, constants.deleteAccount, command)
})

bus.eventEmitter.on(constants.createAccount, command => {
    logger(createAccountHandler, constants.createAccount, command)
})

bus.eventEmitter.on(constants.reinstateAccount, command => {
    logger(reinstateAccountHandler, constants.reinstateAccount, command)
})

bus.eventEmitter.on(constants.updateAccountAddress, command => {
    logger(updateAccountAdderssHandler, constants.updateAccountAddress, command)
})


