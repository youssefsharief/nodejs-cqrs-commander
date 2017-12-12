const eventEmitter = require('../command-handlers/account-command-handlers')
const commandsConstants = require('../config/commands.constants')
const joi = require('joi')

eventEmitter.on('commandRecevied', (commandName, command)=>{
    switch (commandName) {
        case commandsConstants.createAccount:
            return accountEntity.create(command.newAccountId, command.businessName, command.accountNumber)
        case commandsConstants.reinstateAccount:
            return accountEntity.reinstate(accountBeforeCommandConducted)
        case commandsConstants.deleteAccount:
            return accountEntity.deleteAccount(accountBeforeCommandConducted, command.reason)
        case commandsConstants.updateAccountAddress:
            return accountEntity.changeAddress(accountBeforeCommandConducted, command.addressLine1, command.addressLine2, command.city, command.postcode, command.state, command.countryName)
        case commandsConstants.approveAccount:
            return accountEntity.approve(accountBeforeCommandConducted, command.approvedBy)
        default:
            break;
    }
})

