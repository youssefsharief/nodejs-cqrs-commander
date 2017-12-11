const statusSubEntity = require('./sub-entities/status')
const systemTagSubEntity = require('./sub-entities/system-tag')
const addressSubentity = require('./sub-entities/address')
const crypto = require("crypto");
const eventsConstants = require('../config/events.constants')
const domainEvents = require('../config/events.constants').domainEvents
const events = require('events');
const joi = require('joi')
const eventEmitter = new events.EventEmitter();



function create(newAccountId, businessName, accountNumber) {
    joi.assert(businessName, joi.string().min(2).max(10).required(),'Business Name')
    joi.assert(accountNumber, joi.number().min(1000).max(10000).required(), 'Account Number')
    const accountId = newAccountId ? newAccountId : crypto.randomBytes(16).toString("hex");
    const e = { accountId, businessName, accountNumber }
    const account = applyCreate(e)
    eventEmitter.emit(eventsConstants.internallyDone, domainEvents.accountCreated, e)
    addSystemTag(account, "Transportation", true, false)
    addSystemTag(account, "Sick Leave", false, true)
    addSystemTag(account, "Training", true, true)
    return account
}

function applyCreate(e) {
    const account = { id: e.accountId, businessName: e.businessName, accountNumber: e.accountNumber, systemTags: [], status: {}, address: {} }
    return account
}







function addSystemTag(account, name, appliesToExpenses, appliesToTimesheets) {
    if (account.systemTags.find(x => x.name === name)) throw Error("This system tag already exixsts")
    const e = { id: account.id, name, appliesToExpenses, appliesToTimesheets }
    applyAddSytemTag(account, e)
    eventEmitter.emit(eventsConstants.internallyDone, domainEvents.systemTagAdded, e)
}

function applyAddSytemTag(account, e) {
    account.systemTags.push(systemTagSubEntity(e.name, e.appliesToExpenses, e.appliesToTimesheets))
    return account
}






function deleteAccount(account, reason) {
    joi.assert(reason, joi.string().min(1).required().max(100))
    if (account.status.isDeleted) throw Error('Can not delete a deleted account')
    const e = { id: account.id, reason }
    applyDelete(account, e)
    eventEmitter.emit(eventsConstants.internallyDone, domainEvents.accountDeleted, e)
    return account
}

function applyDelete(account, e) {
    account.status = statusSubEntity(account.status.isApproved, account.status.approvedBy, true, e.reason)
    return account
}









function approve(account, approvedBy) {
    if (!approvedBy) throw Error('You could not have a blank approvedBy')
    if (account.status.isApproved) throw Error('Your account is already approved')
    const e = { id: account.id, approvedBy }
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
    const e = { id: account.id }
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
    const e = { id: account.id, addressLine1, addressLine2, city, postcode, state, countryName }
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


