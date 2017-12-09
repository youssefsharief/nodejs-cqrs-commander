



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