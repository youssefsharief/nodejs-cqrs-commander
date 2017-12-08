const StatusSubEntity = require('./sub-entities/status')
const SystemTagSubEntity = require('./sub-entities/system-tag')
const AddressSubentity = require('./sub-entities/address')


function addSystemTag(account, name, appliesToExpenses, appliesToTimesheets) {
    if (account.systemTags.find(x => x.name === name)) throw Error("This system tag already exixsts")
    const sysTag = SystemTagSubEntity(name, appliesToExpenses, appliesToTimesheets)
    return systemTagAdded(account, sysTag)
}

function deleteAccount(account, reason) {
    if (!reason) throw Error('You could not have a blank deleted reason')
    else {
        const status = StatusSubEntity(account.status.isApproved, account.status.approvedBy, true, reason)
        return deleted(account, status)
    }
}

function approve(account, approvedBy) {
    if (!approvedBy) throw Error('You could not have a blank approvedBy')
    if (account.status.isApproved) throw Error('Your account is already approved')
    else {
        const status = StatusSubEntity(true, approvedBy, false, null)
        return approved(account, status)
    }
}

function reinstate(account) {
    if (!status.isDeleted(account.status)) throw Error('It is not even deleted')
    else {
        const status = StatusSubEntity(account.status.isApproved, account.status.approvedBy, false, null)
        return reinstated(account, status)
    }
}

function changeAddress(account, addressLine1, addressLine2, city, postcode, state, countryName) {
    if (!status.isDeleted(account.status)) throw Error('Account is deleted')
    else {
        const newAddress = AddressSubentity(addressLine1, addressLine2, city, postcode, state, countryName)
        return changedAddress(account, newAddress)
    }
}

module.exports = { addSystemTag, changeAddress, approve, deleteAccount, reinstate }

function systemTagAdded(account, sysTag) {
    account.systemTags.push(sysTag)
    return account
}


function changedAddress(account, newAddress) {
    account.address = newAddress
    return account
}



function reinstated(account, status) {
    account.status = status
    return account
}

function approved(account, status) {
    account.status = status
    return account
}


function deleted(account, status) {
    account.status = status
    return account
}

function approved(account, status) {
    account.status = status
    return account
}