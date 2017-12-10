
const entity = require('../entities/account')

function getCurrentStateFromEventsAndLatestSnapshot(events, snapshot){
    return  events.reduce((acc, e) => {
        switch (e.name) {
            case events.accountCreated: return entity.init(e.payload)
            case events.accountApproved: return entity.applyApprove(acc, e.payload)
            case events.accountDeleted: return entity.applyDelete(acc, e.payload)
            case events.accountReinstated: return entity.applyReinstate(acc, e.payload)
            case events.accountAddressUpdated: return entity.applyChangeAddress(acc, e.payload)
            case events.systemTagAdded: return entity.applyAddSytemTag(acc, e.payload)
        }
    }, snapshot? snapshot.aggregateState: {})
}


module.exports = {getCurrentStateFromEventsAndLatestSnapshot}