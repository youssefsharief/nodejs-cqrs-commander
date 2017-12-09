
function applyChange(aggregate, e, applyFn, eventName){
    try{
        applyFn(aggregate, e)
    } catch (e) {
        throw e
    }

    aggregate.accountId

    var domainEventEnvelope = new DomainEventEnvelope(Id, ++LastEventSequence, Version, e);
    _uncommittedEvents.Enqueue(domainEventEnvelope);
}


function applyEvent(account, e, applyFn){
    
}






async function save(){
    concurrencyCheck()

    await EventModel.insertMany(uncommitedEvents)

    const snapshotRequired = uncommitedEvents.find(e => e.sequence % interval===0)

    if (snapshotRequired) SnapshotModel.save(snapshotRequired)

    uncommitedEvents.forEach(x => publish(x.event))
    
}






function postEvent(event){
    const e = new eventModel(event)
    e.save().then(ok=>console.log(ok)).catch(err=>console.log(err))
}