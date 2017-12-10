
const constants = require('./config/commands.constants')
const bus = require('./messaging/receive-commands')
const logger = require('../Ximo/CQRS/logging-command-decorator')
const { getLatestSnapShotByAggregateId, getSortedAggregateEventsAfterSnaphot, getSortedAllAggregateEvents } = require('./database/write/events.ctrl')
const { approveAccountHandler, createAccountHandler, deleteAccountHandler,
    reinstateAccountHandler, updateAccountAdderssHandler } = require('./command-handlers/account-command-handlers')

const reduce = require('./reducers/account-reducer')
const accountEntity = require('./entities/account')
const eventsConstants = require('./config/events.constants')
const {validateApproveInput} = require('./entities/validation/account-validation')
bus.pollQueueForMessages()

bus.eventEmitter.on(constants.approveAccount, async command => {



    let snapshot = null
    let eventsToBeAppliedToEntity = []
    let eventSequence = null
    let aggregateVersion = null

    async function init() {
        snapshot = await getLatestSnapShotByAggregateId(command.id)
        let nextQuery
        if (snapshot) {
            nextQuery = getSortedAggregateEventsAfterSnaphot(snapshot)
            // version = snapshot.eventVersion
        } else {
            nextQuery = getSortedAllAggregateEvents(command.id)
            // version = events.length
        }

        eventsToBeAppliedToEntity = await nextQuery

        eventSequence = eventsToBeAppliedToEntity[eventsToBeAppliedToEntity.length - 1].eventSequence
        aggregateVersion  = eventsToBeAppliedToEntity[eventsToBeAppliedToEntity.length - 1].aggregateVersion
    }

    function getCurrentAggregateStateFromDbAndReducer() {
        return reduce(eventsToBeAppliedToEntity, snapshot)
    }

    await init()
    const accountBeforeCommandConducted = getCurrentAggregateStateFromDbAndReducer(command.id)


    const accountAggregateAfterPerformingCommand = accountEntity.approve(accountBeforeCommandConducted, validateApproveInput(command.approvedBy))

    const eventsToBeSaved = []
    accountEntity.eventEmitter.on(eventsConstants.internallyDone, (eventName, payload) => {
        eventsToBeSaved.push({ name: eventName, aggregateId: command.id, payload, eventSequence: ++eventSequence, aggregateVersion:aggregateVersion + 1 })
    })





    const { event, aggregateAfterEvent, eventName } = accountEntity.approve(accountBeforeCommandConducted)
    global.mem.addPartialEventToBeSaved({ payload: event, name: eventName, aggregateInCaseNeeded: aggregateAfterEvent })









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



class InitialDbInterActionAfterCommand {





    saveEvent() {

    }


}

