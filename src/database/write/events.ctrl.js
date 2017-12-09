const EventModel = require('./models/event.model')
const snapshotModel = require('./models/snapshot.model')


async function getAllAggregateEvents(aggregateId) {
    const latestSnapshot = await getLatestSnapShotByAggregateId(aggregateId)
    if (!latestSnapshot) return await EventModel.find({ aggregateId }).then(events=>({events, latestAggregate:null})).catch(err => { throw Error(err) })
    
}

async function getAggregateEventsAfterSnaphot(latestSnapshot) {
    return await EventModel.find({ aggregateId: latestSnapshot.aggregateId }, { eventSequence: { $gt: latestSnapshot.eventVersion } }).sort({ eventSequence: 1 })
    .lean().exec().catch(err => { throw Error(err) })
}


async function getLatestSnapShotByAggregateId(id) {
    return await snapshotModel.find({ aggregateId: id }).sort({ eventVersion: 1 }).limit(1).lean().exec().catch(err => { throw Error(err) })
}


module.exports = { getAllAggregateEvents, getAggregateEventsAfterSnaphot, getLatestSnapShotByAggregateId }