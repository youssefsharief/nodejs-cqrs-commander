
const entity = require('../entities/account')
const eventsConstants = require('../config/events.constants')

function getCurrentStateFromEventsAndLatestSnapshot(events, aggregateState) {
    return events.reduce((acc, e) => {
        switch (e.name) {
            case eventsConstants.accountCreated: return entity.applyCreate(e.payload)
            case eventsConstants.accountApproved: return entity.applyApprove(acc, e.payload)
            case eventsConstants.accountDeleted: return entity.applyDelete(acc, e.payload)
            case eventsConstants.accountReinstated: return entity.applyReinstate(acc, e.payload)
            case eventsConstants.accountAddressUpdated: return entity.applyChangeAddress(acc, e.payload)
            case eventsConstants.systemTagAdded: return entity.applyAddSytemTag(acc, e.payload)
        }
    }, aggregateState ? aggregateState : {})
}


module.exports = { getCurrentStateFromEventsAndLatestSnapshot }