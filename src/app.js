
const constants = require('./config/commands.constants')
const bus = require('./messaging/receive-commands')
const logger = require('../Ximo/CQRS/logging-command-decorator')
const { getAggregateEventsAfterSnaphot, getAllAggregateEvents, getLatestSnapShotByAggregateId } = require('./database/write/events.ctrl')
const { approveAccountHandler, createAccountHandler, deleteAccountHandler,
    reinstateAccountHandler, updateAccountAdderssHandler } = require('./command-handlers/account-command-handlers')

const reduce = require('./reducers/account-reducer')
const accountEntity = require('./entities/account')
const eventsConstants = require('./config/events.constants')

bus.pollQueueForMessages()

bus.eventEmitter.on(constants.approveAccount, async command => {



    let snapshot = null
    let eventsToBeAppliedToEntity = []

    async function init() {
        snapshot = await getLatestSnapShotByAggregateId(command.id)
        if (snapshot) {
            eventsToBeAppliedToEntity = await getAggregateEventsAfterSnaphot(this.snapshot)
            // this.version = this.snapshot.eventVersion
        } else {
            eventsToBeAppliedToEntity = await getAllAggregateEvents(this.id)
            // this.version = events.length
        }
    }

    function getCurrentAggregateStateFromDbAndReducer() {
        return reduce(eventsToBeAppliedToEntity, snapshot)
    }

    await init()
    const accountBeforeCommandConducted = getCurrentAggregateStateFromDbAndReducer(command.id)


    const accountAggregateAfterPerformingCommand = accountEntity.approve(accountBeforeCommandConducted)

    const eventsToBeSaved = []
    accountEntity.eventEmitter.on(eventsConstants.internallyDone, (eventName, payload) => {
        eventsToBeSaved.push()
    })





    const { event, aggregateAfterEvent, eventName } = accountEntity.approve(accountBeforeCommandConducted)
    global.mem.addPartialEventToBeSaved( { payload: event, name: eventName, aggregateInCaseNeeded: aggregateAfterEvent })









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

