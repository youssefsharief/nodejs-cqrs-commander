

// var accountEvents = AccountModel.find().len().exec()

const accountEvents = [
    { name: 'created', payload: { address: { line: 'hjhj' } } },
    { name: 'deleted', },
    { name: 'reinstated', },
    { name: 'accountAddressUpdated', payload: { address: { line: 'hjhj' } } },
    { name: 'approved', },
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


