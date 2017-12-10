
const constants = require('./config/commands.constants')
const bus = require('./messaging/receive-commands')
const logger = require('../Ximo/CQRS/logging-command-decorator')
const { getAggregateEventsAfterSnaphot, getAllAggregateEvents, getLatestSnapShotByAggregateId } = require('./database/write/events.ctrl')
const { approveAccountHandler, createAccountHandler, deleteAccountHandler,
    reinstateAccountHandler, updateAccountAdderssHandler } = require('./command-handlers/account-command-handlers')

const reduce = require('./reducers/account-reducer')
const accountEntity = require('./entities/account')
bus.pollQueueForMessages()

bus.eventEmitter.on(constants.approveAccount, async command => {
    const requestId = Math.random(8);

    // if (!global.mem) global.mem = {}
    // if (!global.mem.requests.length) global.mem.requests = []


    // global.mem.createNewRequest()


    ximux.initNewCommand(requestId, command, constants.approveAccount)

    const idb = new InitialDbInterActionAfterCommand(command.id, requestId)
    await idb.init()
    const accountBeforeCommandConducted = idb.getCurrentAggregateStateFromDbAndReducer(command.id)

    accountEntity.approve(accountBeforeCommandConducted)

    global.mem.addPartialEventToBeSaved(requestId, eventPayload, eventName, aggregateAfterEvent)









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

    constructor(id, requestId) {
        this.id = id
        this.requestId = requestId
    }

    async init() {
        this.snapshot = await getLatestSnapShotByAggregateId(this.id)

        if (this.snapshot) {
            this.events = await getAggregateEventsAfterSnaphot(this.snapshot)
            global.mem.addSnapshot(this.requestId)
            global.mem.addEvents(this.events)
            // this.version = this.snapshot.eventVersion

        }
        else {
            this.events = await getAllAggregateEvents(this.id)
            global.mem.addEventsToBePlayed(this.requestId, this.events)
            // this.version = events.length
        }
    }

    getCurrentAggregateStateFromDbAndReducer() {
        return reduce(this.events, this.snapshot)

    }

    saveEvent() {

    }


    
    


}

