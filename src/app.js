
const constatnts = require('./config/commands.constants')
const bus = require('./messaging/receive-commands')
const logger = require('../Ximo/CQRS/logging-command-decorator')
const {getAggregateEventsAfterSnaphot, getAllAggregateEvents, getLatestSnapShotByAggregateId} = require('./database/write/events.ctrl')
const {approveAccountHandler, createAccountHandler, deleteAccountHandler, 
    reinstateAccountHandler, updateAccountAdderssHandler} = require('./command-handlers/account-command-handlers')

const reduce = require('./reducers/account-reducer')
const accountEntity = require('./entities/account')
bus.pollQueueForMessages()

bus.eventEmitter.on(constatnts.approveAccount, async command => {
   
    const snapshot = await getLatestSnapShotByAggregateId(command.id)
    let events 
    if (snapshot)  events = await getAggregateEventsAfterSnaphot(snapshot)
        
    
    else events = await getAllAggregateEvents(command.id)
    const currentState = reduce(events, snapshot)
    account = accountEntity.
    
    
    
    

   






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


