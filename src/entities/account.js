const StatusSubEntity = require('./sub-entities/status')
const SystemTagSubEntity = require('./sub-entities/system-tag')
const AddressSubentity = require('./sub-entities/address')
const crypto = require("crypto");
const eventsConstants = require('../config/events.constants')
const events = require('events');
const eventEmitter = new events.EventEmitter();


function init(newAccountId, businessName, accountNumber) {
    const accountId = newAccountId ? newAccountId : crypto.randomBytes(16).toString("hex");
    const accountCreatedEvent = { accountId, businessName, accountNumber }
    const account = applyCreateAccount(accountCreatedEvent)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.accountCreated, accountCreatedEvent)
    addSystemTag(account, "Transportation", true, false)
    addSystemTag(account, "Sick Leave", false, true)
    addSystemTag(account, "Training", true, true)
}

function applyCreateAccount(e) {
    const account = { id: e.accountId, businessName: e.businessName, accountNumber: e.accountNumber, systemTags: [], status: {}, address: {} }
    return account
}

function addSystemTag(account, name, appliesToExpenses, appliesToTimesheets) {
    if (account.systemTags.find(x => x.name === name)) throw Error("This system tag already exixsts")
    const event = { accountId: account.id, name, appliesToExpenses, appliesToTimesheets }
    applyAddSytemTag(account, event)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.systemTagAdded, event)
}

function applyAddSytemTag(account, e) {
    account.systemTags.push(SystemTagSubEntity(e.name, e.appliesToExpenses, e.appliesToTimesheets))
    return account
}


function deleteAccount(account, reason) {
    if (!reason) throw Error('You could not have a blank deleted reason')
    const event = { accountId: account.id, reason }
    applyDelete(account, event)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.accountDeleted, event)
}

function applyDelete(account, e) {
    account.status = StatusSubEntity(account.status.isApproved, account.status.approvedBy, true, e.reason)
    return account
}


function approve(account, approvedBy) {
    if (!approvedBy) throw Error('You could not have a blank approvedBy')
    if (account.status.isApproved) throw Error('Your account is already approved')
    const event = { accountId: account.id, approvedBy }
    applyApprove(account, event)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.accountApproved, event)
}

function applyApprove(account, e) {
    account.status = StatusSubEntity(true, e.approvedBy, false, null)
    return account
}

function reinstate(account) {
    if (!account.status.isDeleted) throw Error('The account cannot be reinstated as it has not been deleted in the first place :)')
    const event = { accountId: account.id }
    applyReinstate(account, event)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.accountReinstated, event)
}

function applyReinstate(account, e) {
    account.status = StatusSubEntity(account.status.isApproved, account.status.approvedBy, false, null)
    return account
}


function changeAddress(account, addressLine1, addressLine2, city, postcode, state, countryName) {
    if (!account.status.isDeleted) throw Error('Account is deleted')
    const event = { accountId: account.id, addressLine1, addressLine2, city, postcode, state, countryName }
    applyChangeAddress(account, event)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.accountAddressUpdated, event)
}

function applyChangeAddress(account, e) {
    account.address = AddressSubentity(e.addressLine1, e.addressLine2, e.city, e.postcode, e.state, e.countryName)
    return account

}

module.exports = {
    addSystemTag, changeAddress, approve, deleteAccount, reinstate, init, applyChangeAddress, applyReinstate,
    applyApprove, applyDelete, applyAddSytemTag, applyChangeAddress, applyAddSytemTag, eventEmitter
}


