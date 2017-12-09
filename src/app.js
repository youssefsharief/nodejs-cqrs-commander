
const constatnts = require('./config/commands.constants')
const bus = require('./messaging/receive-commands')
const logger = require('../Ximo/CQRS/logging-command-decorator')
const { getAggregateEventsAfterSnaphot, getAllAggregateEvents, getLatestSnapShotByAggregateId } = require('./database/write/events.ctrl')
const { approveAccountHandler, createAccountHandler, deleteAccountHandler,
    reinstateAccountHandler, updateAccountAdderssHandler } = require('./command-handlers/account-command-handlers')

const reduce = require('./reducers/account-reducer')
const accountEntity = require('./entities/account')
bus.pollQueueForMessages()

bus.eventEmitter.on(constatnts.approveAccount, async command => {
    global.commands = []
    global.commands.push({id: command.id, ds})
    const idb = new InitialDbInterActionAfterCommand(command.id)
    await idb.init()
    const accountBeforeCommandConducted = idb.getCurrentAggregateStateFromDbAndReducer(command.id)
    const eventPayload = accountEntity.approve(accountBeforeCommandConducted)

    idb.saveEvent({payload:eventPayload, name: 'accountApproved'})












    logger(approveAccountHandler, constatnts.approveAccount, command)
})

bus.eventEmitter.on(constatnts.deleteAccount, command => {
    logger(deleteAccountHandler, constatnts.deleteAccount, command)
})

bus.eventEmitter.on(constatnts.createAccount, command => {
    logger(createAccountHandler, constatnts.createAccount, command)
})

bus.eventEmitter.on(constatnts.reinstateAccount, command => {
    logger(reinstateAccountHandler, constatnts.reinstateAccount, command)
})

bus.eventEmitter.on(constatnts.updateAccountAddress, command => {
    logger(updateAccountAdderssHandler, constatnts.updateAccountAddress, command)
})



class InitialDbInterActionAfterCommand {

    constructor(id) {
        this.id = id
    }

    async init() {
        this.snapshot = await getLatestSnapShotByAggregateId(this.id)
        let events
        if (this.snapshot) {
            this.events = await getAggregateEventsAfterSnaphot(this.snapshot)
            this.version = this.snapshot.eventVersion
        }
        else {
            this.events = await getAllAggregateEvents(this.id)
            this.version = events.length
        }
    }

    getCurrentAggregateStateFromDbAndReducer() {
        return reduce(this.events, this.snapshot)
    }

    saveEvent() {

    }


    applyChange(aggregate, event, applyFn, eventName){
        try{
            applyFn(aggregate, event)
        } catch (err) {
            throw err
        }
    
        aggregate.accountId
    
        var domainEventEnvelope = new DomainEventEnvelope(Id, ++LastEventSequence, Version, e);
        _uncommittedEvents.Enqueue(domainEventEnvelope);
    }


}
