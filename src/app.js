
// const constatnts = require('./config/commands.constants')
// const bus = require('./messaging/receive-commands')
// const logger = require('../Ximo/CQRS/logging-command-decorator')

// const {approveAccountHandler, createAccountHandler, deleteAccountHandler, 
//     reinstateAccountHandler, updateAccountAdderssHandler} = require('./command-handlers/account-command-handlers')

// bus.pollQueueForMessages()

// bus.eventEmitter.on(constatnts.approveAccount, command => {
//     logger(approveAccountHandler, constatnts.reinstateAccount, command)
// })

// bus.eventEmitter.on(constatnts.deleteAccount, command => {
//     logger(deleteAccountHandler, constatnts.reinstateAccount, command)
// })

// bus.eventEmitter.on(constatnts.createAccount, command => {
//     logger(createAccountHandler, constatnts.reinstateAccount, command)
// })

// bus.eventEmitter.on(constatnts.reinstateAccount, command => {
//     logger(reinstateAccountHandler, constatnts.reinstateAccount, command)
// })

// bus.eventEmitter.on(constatnts.updateAccountAddress, command => {
//     logger(updateAccountAdderssHandler, constatnts.updateAccountAddress, command)
// })


const testEventSource = require('./testEventSource')
// testEventSource()