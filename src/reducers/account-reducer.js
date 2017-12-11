
const entity = require('../entities/account')
const domainEvents = require('../config/events.constants').domainEvents

function getCurrentStateFromEventsAndLatestSnapshot(events, aggregateState) {
    return events.reduce((acc, e) => {
        switch (e.name) {
            case domainEvents.accountCreated: return entity.applyCreate(e.payload)
            case domainEvents.accountApproved: return entity.applyApprove(acc, e.payload)
            case domainEvents.accountDeleted: return entity.applyDelete(acc, e.payload)
            case domainEvents.accountReinstated: return entity.applyReinstate(acc, e.payload)
            case domainEvents.accountAddressUpdated: return entity.applyChangeAddress(acc, e.payload)
            case domainEvents.systemTagAdded: return entity.applyAddSytemTag(acc, e.payload)
        }
    }, aggregateState ? aggregateState : {})
}


module.exports = { getCurrentStateFromEventsAndLatestSnapshot }