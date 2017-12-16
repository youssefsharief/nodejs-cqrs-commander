const statusSubEntity = require('./sub-entities/status')
const systemTagSubEntity = require('./sub-entities/system-tag')
const addressSubentity = require('./sub-entities/address')
const generateId = require("../services/id-generator").id;
const eventsConstants = require('../config/events.constants')
const domainEvents = require('../config/events.constants').domainEvents
const events = require('events');
const eventEmitter = new events.EventEmitter();



function create(accountId, businessName, accountNumber) {
    const e = { accountId, businessName, accountNumber }
    const account = applyCreate(e)
    eventEmitter.emit(eventsConstants.internallyDone, domainEvents.accountCreated, e)
    addSystemTag(account, "Transportation", true, false)
    addSystemTag(account, "Sick Leave", false, true)
    addSystemTag(account, "Training", true, true)
    return account
}

function applyCreate(e) {
    const account = { accountId: e.accountId, businessName: e.businessName, accountNumber: e.accountNumber, systemTags: [], status: {}, address: {} }
    return account
}







function addSystemTag(account, name, appliesToExpenses, appliesToTimesheets) {
    if (account.systemTags.find(x => x.name === name)) throw Error("This system tag already exixsts")
    const e = { systemTagId:generateId(), name, appliesToExpenses, appliesToTimesheets }
    applyAddSytemTag(account, e)
    eventEmitter.emit(eventsConstants.internallyDone, domainEvents.systemTagAdded, e)
}

function applyAddSytemTag(account, e) {
    account.systemTags.push(systemTagSubEntity(e.name, e.appliesToExpenses, e.appliesToTimesheets))
    return account
}






function deleteAccount(account, reason) {
    if (account.status.isDeleted) throw Error('Can not delete a deleted account')
    const e = { accountId: account.accountId, reason }
    applyDelete(account, e)
    eventEmitter.emit(eventsConstants.internallyDone, domainEvents.accountDeleted, e)
    return account
}

function applyDelete(account, e) {
    account.status = statusSubEntity(account.status.isApproved, account.status.approvedBy, true, e.reason)
    return account
}









function approve(account, approvedBy) {
    if (account.status.isApproved) throw Error('Your account is already approved')
    const e = { id: account.accountId, approvedBy }
    applyApprove(account, e)
    eventEmitter.emit(eventsConstants.internallyDone, domainEvents.accountApproved, e)
    return account
}

function applyApprove(account, e) {
    account.status = statusSubEntity(true, e.approvedBy, false, null)
    return account
}




function reinstate(account) {
    if (!account.status.isDeleted) throw Error('The account cannot be reinstated as it has not been deleted in the first place :)')
    const e = { id: account.accountId }
    applyReinstate(account, e)
    eventEmitter.emit(eventsConstants.internallyDone, domainEvents.accountReinstated, e)
    return account
}

function applyReinstate(account, e) {
    account.status = statusSubEntity(account.status.isApproved, account.status.approvedBy, false, null)
    return account
}







function changeAddress(account, addressLine1, addressLine2, city, postcode, state, countryName) {
    if (account.status.isDeleted) throw Error('Account is deleted')
    const e = { id: account.accountId, addressLine1, addressLine2, city, postcode, state, countryName }
    applyChangeAddress(account, e)
    eventEmitter.emit(eventsConstants.internallyDone, domainEvents.accountAddressUpdated, e)
    return account
}


function applyChangeAddress(account, e) {
    account.address = addressSubentity(e.addressLine1, e.addressLine2, e.city, e.postcode, e.state, e.countryName)
    return account
}



module.exports = {
    addSystemTag, changeAddress, approve, deleteAccount, reinstate, create, applyCreate, applyChangeAddress, applyReinstate,
    applyApprove, applyDelete, applyAddSytemTag, applyChangeAddress, applyAddSytemTag, eventEmitter
}


