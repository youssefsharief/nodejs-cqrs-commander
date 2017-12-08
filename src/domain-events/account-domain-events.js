

const addressUpdated = (accountId, addressLine1, addressLine2, city, postCode, state, countryName) =>
    ({ accountId, addressLine1, addressLine2, city, postCode, state, countryName })

const systemTagAdded = (accountId, name, appliesToExpenses, appliesToTimesheets) => ({ accountId, name, appliesToExpenses, appliesToTimesheets })

const accountReinstated = (accountId) => ({ accountId })

const accountDeleted = (accountId, reason) => ({ accountId, reason })

const accountCreated = (accountId, businessName, accountNumber) => ({ accountId, businessName, accountNumber })

const accountApproved = (accountId, approvedBy) => ({ accountId, approvedBy })


