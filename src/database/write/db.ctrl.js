const eventModel = require('./models/event.model')
const snapshotModel = require('./models/snapshot.model')


async function getSortedAllAggregateEvents(aggregateId) {
    return await eventModel.find({ aggregateId }).sort({ eventSequence: 1 }).lean().exec().catch(err => { throw Error(err) })
}

async function getSortedAggregateEventsAfterSnaphot(latestSnapshot) {
    return await eventModel.find({ aggregateId: latestSnapshot.aggregateId }, { eventSequence: { $gt: latestSnapshot.eventVersion } })
        .sort({ eventSequence: 1 }).lean().exec().catch(err => { throw Error(err) })
}


async function getLatestSnapShotByAggregateId(id) {
    return await snapshotModel.find({ aggregateId: id }).sort({ eventVersion: 1 }).limit(1).lean().exec().catch(err => { throw Error(err) })
}


async function concurrencyCheck(aggregateId, aggregateVersion) {
    const persistedVersion = await eventModel.find({ aggregateId }).select('aggregateVersion')
    if (aggregateVersion === persistedVersion + 1) {
        throw Error('The aggregate with aggregate has been modified and the event stream cannot be appended.')
    }
}


async function saveEvents(uncommitedEvents) {
    await eventModel.insertMany(uncommitedEvents).catch(err => { throw Error(err) })
}




module.exports = { getSortedAllAggregateEvents, getSortedAggregateEventsAfterSnaphot, getLatestSnapShotByAggregateId, concurrencyCheck, saveEvents }