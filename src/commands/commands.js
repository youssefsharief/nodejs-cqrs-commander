const events = require('events');
const internalCommandsEventEmitter = new events.EventEmitter();
const {accountAddressUpdated, accountApproved, accountCreated, accountDeleted, accountReinstated} = require('../config/events.constants')

const commands = {
    approveAccount(accountId, approvedBy) {
        internalCommandsEventEmitter.emit(accountApproved, {accountId, approvedBy})
    },
    createAccount(newAccountId, firstName, lastName, businessName, userEmail) {
        internalCommandsEventEmitter.emit(accountCreated, {newAccountId, firstName, lastName, businessName, userEmail})
    },
    deleteAccount(accountId, reason) {
        internalCommandsEventEmitter.emit(accountDeleted,{accountId, reason})
    },
    reinstateAccount(accountId) {
        internalCommandsEventEmitter.emit(accountReinstated,accountId)
    },
    updateAccountAdderss( accountId,  addressLine1,  addressLine2,  postcode, city,  state,  countryName) {
        internalCommandsEventEmitter.emit(accountAddressUpdated,{accountId,  addressLine1,  addressLine2,  postcode, city,  state,  countryName})
    },
}



module.exports = {commands, internalCommandsEventEmitter}