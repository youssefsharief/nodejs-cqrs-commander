const joi = require('joi')

function handleCreateAccountCommand(command) {
    validateCommandPayload(command)
    getDataFromDb(command)
    getVersionAndSequence(eventsToBeAppliedToEntity)
}

function validateCommandPayload(command) {
    joi.assert(command.businessName, joi.string().min(2).max(10).required().label('Business Name'))
    joi.assert(command.accountNumber, joi.number().min(1000).max(10000).required().label('Business Name'))
}



async function getDataFromDb(command) {
    const snapshot = await db.getLatestSnapShotByAggregateId(command.id)
    let query
    if (snapshot) {
        query = db.getSortedlastEventsOnly(snapshot.aggregateRootId, snapshot.lastEventSequence)
    } else {
        query = db.getSortedAllAggregateEvents(command.id)
    }
    const eventsToBeAppliedToEntity = await query
    return {eventsToBeAppliedToEntity, snapshot}
}






function getVersionAndSequence(eventsToBeAppliedToEntity){
    const areEventsAvailable = () => eventsToBeAppliedToEntity.length
    const eventSequence =  areEventsAvailable ? eventsToBeAppliedToEntity[eventsToBeAppliedToEntity.length - 1].eventSequence : 1
    const aggregateVersion = areEventsAvailable ? eventsToBeAppliedToEntity[eventsToBeAppliedToEntity.length - 1].aggregateVersion: 1
    return {eventSequence, aggregateVersion}
}