const eventModel = require('../models/event.model')
const snapshotModel = require('../models/snapshot.model')

function postEvent(event){
    

    const e = new eventModel(event)
    e.save().then(ok=>console.log(ok)).catch(err=>console.log(err))
}


function getLatestSnapShotByAggregateId(id) {
    return snapshotModel.find({aggregateId:id}).limit(1).lean().exec()
}

module.exports = {postEvent, getLatestSnapShotByAggregateId}