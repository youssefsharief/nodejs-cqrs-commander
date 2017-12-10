const statusSubEntity = require('./sub-entities/status')
const systemTagSubEntity = require('./sub-entities/system-tag')
const addressSubentity = require('./sub-entities/address')
const crypto = require("crypto");
const eventsConstants = require('../config/events.constants')
const events = require('events');
const joi = require('joi')
const eventEmitter = new events.EventEmitter();


function create(newAccountId, businessName, accountNumber) {
    joi.assert(businessName, joi.string().min(2).max(10).required())
    joi.assert(accountNumber, joi.number().min(1000).max(1000).required())
    const accountId = newAccountId ? newAccountId : crypto.randomBytes(16).toString("hex");
    const accountCreatedEvent = { accountId, businessName, accountNumber }
    const account = applyCreate(accountCreatedEvent)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.accountCreated, accountCreatedEvent)
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
    const event = { accountId: account.id, name, appliesToExpenses, appliesToTimesheets }
    applyAddSytemTag(account, event)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.systemTagAdded, event)
}

function applyAddSytemTag(account, e) {
    account.systemTags.push(systemTagSubEntity(e.name, e.appliesToExpenses, e.appliesToTimesheets))
    return account
}


function deleteAccount(account, reason) {
    joi.assert(reason, joi.string().min(1).required().max(100))
    if (account.status.isDeleted) throw Error('Can not delete a deleted account')
    const event = { accountId: account.id, reason }
    applyDelete(account, event)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.accountDeleted, event)
    return account
}

function applyDelete(account, e) {
    account.status = statusSubEntity(account.status.isApproved, account.status.approvedBy, true, e.reason)
    return account
}


function approve(account, approvedBy) {
    if (!approvedBy) throw Error('You could not have a blank approvedBy')
    if (account.status.isApproved) throw Error('Your account is already approved')
    const event = { accountId: account.id, approvedBy }
    applyApprove(account, event)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.accountApproved, event)
    return account
}

function applyApprove(account, e) {
    account.status = statusSubEntity(true, e.approvedBy, false, null)
    return account
}

function reinstate(account) {
    if (!account.status.isDeleted) throw Error('The account cannot be reinstated as it has not been deleted in the first place :)')
    const event = { accountId: account.id }
    applyReinstate(account, event)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.accountReinstated, event)
    return account
}

function applyReinstate(account, e) {
    account.status = statusSubEntity(account.status.isApproved, account.status.approvedBy, false, null)
    return account
}


function changeAddress(account, addressLine1, addressLine2, city, postcode, state, countryName) {
    if (account.status.isDeleted) throw Error('Account is deleted')
    const event = { accountId: account.id, addressLine1, addressLine2, city, postcode, state, countryName }
    applyChangeAddress(account, event)
    eventEmitter.emit(eventsConstants.internallyDone, eventsConstants.accountAddressUpdated, event)
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


