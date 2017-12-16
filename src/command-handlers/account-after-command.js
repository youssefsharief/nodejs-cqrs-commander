
const commandsConstants = require('../config/commands.constants')
const accountEntity = require('../entities/account')

function accountAfterCommand(accountBeforeCommandConducted, command, commandName) {
    switch (commandName) {
        case commandsConstants.createAccount:
            return accountEntity.create(command.newAccountId, command.businessName, command.accountNumber)
        case commandsConstants.reinstateAccount:
            return accountEntity.reinstate(accountAvailable(accountBeforeCommandConducted))
        case commandsConstants.deleteAccount:
            return accountEntity.deleteAccount(accountAvailable(accountBeforeCommandConducted), command.reason)
        case commandsConstants.updateAccountAddress:
            return accountEntity.changeAddress(accountAvailable(accountBeforeCommandConducted), command.addressLine1, command.addressLine2, command.city, command.postcode, command.state, command.countryName)
        case commandsConstants.approveAccount:
            return accountEntity.approve(accountAvailable(accountBeforeCommandConducted), command.approvedBy)
        default:
            break;
    }
}


module.exports = {accountAfterCommand}


function accountAvailable(account) {
    console.log(account)
    
    if (!account) throw Error('This account has not been created before')
    return account
}