
const constatnts = require('./config/commands.constants')
const bus = require('./messaging/receive-commands')

const commands = require('./commands/commands')

bus.pollQueueForMessages()

bus.eventEmitter.on(constatnts.approveAccount, data => {
    commands.approveAccount(data.accountId, data.approvedBy)
})

bus.eventEmitter.on(constatnts.deleteAccount, data => {
    commands.deleteAccount(data.accountId, data.reason)
})

bus.eventEmitter.on(constatnts.createAccount, data => {
    commands.createAccount(data.newAccountId, data.firstName, data.lastName, data.businessName, data.userEmail)
})

bus.eventEmitter.on(constatnts.reinstateAccount, data => {
    commands.reinstateAccount(data.accountId)
})

bus.eventEmitter.on(constatnts.updateAccountAddress, data => {
    commands.updateAccountAddress(data.accountId, data.addressLine1, data.addressLine2, data.postcode, data.city, data.state, data.countryName)
})


