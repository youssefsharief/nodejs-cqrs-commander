const StatusSubEntity = require('./sub-entities/status')
const SystemTagSubEntity = require('./sub-entities/system-tag')
const AddressSubentity = require('./sub-entities/address')

function init(accountId, businessName, accountNumber) {
    let account = { id: accountId, businessName, accountNumber, systemTags:[], status:{}, address:{} }
    account = addSystemTag(account, "Transportation", true, false);
    account = addSystemTag(account, "Sick Leave", false, true);
    account = addSystemTag(account, "Training", true, true);
    return account
}

function addSystemTag(account, name, appliesToExpenses, appliesToTimesheets) {
    if (account.systemTags.find(x => x.name === name)) throw Error("This system tag already exixsts")
    return applyAddSytemTag(account, { accountId: account.id, name, appliesToExpenses, appliesToTimesheets })
}

function applyAddSytemTag(account, e) {
    const sysTag = SystemTagSubEntity(e.name, e.appliesToExpenses, e.appliesToTimesheets)
    account.systemTags.push(sysTag)
    return account
}


function deleteAccount(account, reason) {
    if (!reason) throw Error('You could not have a blank deleted reason')
    return applyDelete(account, { accountId: account.id, reason })
}

function applyDelete(account, e) {
    account.status = StatusSubEntity(account.status.isApproved, account.status.approvedBy, true, e.reason)
    return account
}


function approve(account, approvedBy) {
    if (!approvedBy) throw Error('You could not have a blank approvedBy')
    if (account.status.isApproved) throw Error('Your account is already approved')
    return applyApprove(account, { accountId: account.id, approvedBy })
}

function applyApprove(account, e) {
    account.status = StatusSubEntity(true, e.approvedBy, false, null)
    return account
}

function reinstate(account) {
    if (!account.status.isDeleted) throw Error('The account cannot be reinstated as it has not been deleted in the first place :)')
    // Ximo.applyChange(account, applyReinstate, { accountId: account.id })
    return applyReinstate(account, {accountId: account.id})
}

function applyReinstate(account, e) {
    account.status = StatusSubEntity(account.status.isApproved, account.status.approvedBy, false, null)
    return account
}


function changeAddress(account, addressLine1, addressLine2, city, postcode, state, countryName) {
    if (!account.status.isDeleted) throw Error('Account is deleted')
    return applyChangeAddress(account, { accountId: account.id, addressLine1, addressLine2, city, postcode, state, countryName })
}

function applyChangeAddress(account, e) {
    console.log(e)
    
    account.address = AddressSubentity(e.addressLine1, e.addressLine2, e.city, e.postcode, e.state, e.countryName)
    return account


}

module.exports = {
    addSystemTag, changeAddress, approve, deleteAccount, reinstate, init, applyChangeAddress, applyReinstate,
    applyApprove, applyDelete, applyAddSytemTag, applyChangeAddress, applyAddSytemTag
}


