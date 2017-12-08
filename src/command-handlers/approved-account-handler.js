

// var accountEvents = AccountModel.find().len().exec()
const events=  require('../config/events.constants')
const accountEvents = [
    { name: events.accountCreated, payload: { address: { line: 'hjhj' } } },
    { name: events.accountAddressUpdated, },
    { name: events.accountReinstated, },
]

const latestAccountAggregate = SnapshotModel.find().limit(1)


const accountAggregate = accountEvents.reduce((acc, x) => {
    switch (x.name) {
        case 'created':
            acc.state = true
            acc.address = x.payload.address
            return acc
        case 'approved':
            acc.approved = true
            return acc
        case 'deleted': acc.state = false
            return acc
        case 'reinstated': acc.state = true
            return acc
        case 'accountAddressUpdated': acc.address = x.payload.address
            return acc
        default:
    }
}, {})

console.log(accountAggregate)


