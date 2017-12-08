
const accountDomainEntity = require('../entities/account')
const faker = require('faker')
const accountStore = {}

function approveAccountHandler(command) {
    let account = accountStore.getById(command.accountId)
    account = accountDomainEntity.approve(account, command.ApprovedBy)
    accountStore.save(account)
}

function createAccountHandler(command) {
    const accountNumber = faker.finance.account()
    let account = accountDomainEntity.init(command.accountId, command.businessName, accountNumber)
    accountStore.save(account)
}

function deleteAccountHandler(command) {
    let account = accountStore.getById(command.accountId)
    account = accountDomainEntity.deleteAccount(account, command.reason)
    accountStore.save(account)
}

function reinstateAccountHandler(command) {
    let account = accountStore.getById(command.accountId)
    account = accountDomainEntity.reinstate(account)
    accountStore.save(account)
}

function updateAccountAdderssHandler(command) {
    let account = accountStore.getById(command.accountId)
    account = accountDomainEntity.changeAddress(account, command.addressLine1, command.addressLine2, command.city, command.postcode, command.state, command.countryName)
    accountStore.save(account)
}




module.exports = { approveAccountHandler, createAccountHandler, deleteAccountHandler,  reinstateAccountHandler, updateAccountAdderssHandler}


