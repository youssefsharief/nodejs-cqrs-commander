const eventModel = require('./models/event.model')
const snapshotModel = require('./models/snapshot.model')


async function getSortedAllAggregateEvents(aggregateId) {
    return await eventModel.find({ aggregateId }).sort({ eventSequence: 1 }).lean().exec().catch(err => { throw err })
}

async function getSortedlastEventsOnly(aggregateId, lastEventSequence) {
    return await eventModel.find({ aggregateId, eventSequence: { $gt: lastEventSequence } })
        .sort({ eventSequence: 1 }).lean().exec().catch(err => { throw err })
}


async function getLatestSnapShotByAggregateId(aggregateRootId) {
    const snapshots = await snapshotModel.find({ aggregateRootId }).sort({ lastEventSequence: 1 }).limit(1).lean().exec().catch(err => { throw err })
    if (snapshots.length) return snapshots[0]
    else return null
}


async function concurrencyCheck(aggregateId, aggregateVersion) {
    const arrOfOneEvent = await eventModel.find({ aggregateId }).select('aggregateVersion').sort({ eventSequence: -1 }).limit(1).catch(err => { throw err })
    if (!arrOfOneEvent.length) return 'ok'
    else {
        const persistedVersion = arrOfOneEvent[0].aggregateVersion
        if (!(aggregateVersion === persistedVersion)) {
            throw Error(`The aggregate with aggregateID ${aggregateId} has been modified and the event stream cannot be appended.`)
        } else return 'ok'
    }


}


async function saveEvents(uncommitedEvents) {
    return await eventModel.insertMany(uncommitedEvents).then(x => x).catch(err => { throw err })
}


// For Testing only 
async function removeAllEvents() {
    return await eventModel.remove({}).exec().catch(err => { throw err })
}


async function saveSnapshot(snapshot) {
    const newSnapshot = new snapshotModel(snapshot)
    return await newSnapshot.save().catch(err => { throw err })
}



module.exports = {
    getSortedAllAggregateEvents, getSortedlastEventsOnly,
    getLatestSnapShotByAggregateId, concurrencyCheck, saveEvents, removeAllEvents, saveSnapshot
}