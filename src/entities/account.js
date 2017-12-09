const StatusSubEntity = require('./sub-entities/status')
const SystemTagSubEntity = require('./sub-entities/system-tag')
const AddressSubentity = require('./sub-entities/address')
const crypto = require("crypto");
const events = require('../config/events.constants')

function init(newAccountId, businessName, accountNumber) {
    const accountId = newAccountId ? newAccountId :  crypto.randomBytes(16).toString("hex"); 
    let account = applyChange(account, {accountId, businessName, accountNumber}, applyCreateAccount, events.accountCreated)
    account = addSystemTag(account, "Transportation", true, false);
    account = addSystemTag(account, "Sick Leave", false, true);
    account = addSystemTag(account, "Training", true, true);
    return account
}

function applyCreateAccount( account, {accountId, businessName, accountNumber}){
    return { id: accountId, businessName, accountNumber, systemTags:[], status:{}, address:{} }
}

function addSystemTag(account, name, appliesToExpenses, appliesToTimesheets) {
    if (account.systemTags.find(x => x.name === name)) throw Error("This system tag already exixsts")
    return applyChange(account, { accountId: account.id, name, appliesToExpenses, appliesToTimesheets }, applyAddSytemTag, events.systemTagAdded )
}

function applyAddSytemTag(account, e) {
    account.systemTags.push(SystemTagSubEntity(e.name, e.appliesToExpenses, e.appliesToTimesheets))
    return account
}


function deleteAccount(account, reason) {
    if (!reason) throw Error('You could not have a blank deleted reason')
    return applyChange(account, { accountId: account.id, reason }, applyDelete, events.accountDeleted)
}

function applyDelete(account, e) {
    account.status = StatusSubEntity(account.status.isApproved, account.status.approvedBy, true, e.reason)
    return account
}


function approve(account, approvedBy) {
    if (!approvedBy) throw Error('You could not have a blank approvedBy')
    if (account.status.isApproved) throw Error('Your account is already approved')
    return applyChange(account, { accountId: account.id, approvedBy }, applyApprove, events.accountApproved)
}

function applyApprove(account, e) {
    account.status = StatusSubEntity(true, e.approvedBy, false, null)
    return account
}

function reinstate(account) {
    if (!account.status.isDeleted) throw Error('The account cannot be reinstated as it has not been deleted in the first place :)')
    // Ximo.applyChange(account, applyReinstate, { accountId: account.id })
    return applyChange(account, {accountId: account.id}, applyReinstate, events.accountReinstated)
}

function applyReinstate(account, e) {
    account.status = StatusSubEntity(account.status.isApproved, account.status.approvedBy, false, null)
    return account
}


function changeAddress(account, addressLine1, addressLine2, city, postcode, state, countryName) {
    if (!account.status.isDeleted) throw Error('Account is deleted')
    return applyChange(account, { accountId: account.id, addressLine1, addressLine2, city, postcode, state, countryName }, 
        applyChangeAddress, events.accountAddressUpdated)
}

function applyChangeAddress(account, e) {
    account.address = AddressSubentity(e.addressLine1, e.addressLine2, e.city, e.postcode, e.state, e.countryName)
    return account

}

module.exports = {
    addSystemTag, changeAddress, approve, deleteAccount, reinstate, init, applyChangeAddress, applyReinstate,
    applyApprove, applyDelete, applyAddSytemTag, applyChangeAddress, applyAddSytemTag,
}


