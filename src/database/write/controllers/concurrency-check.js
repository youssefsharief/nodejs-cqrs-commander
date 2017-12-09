
async function concurrencyCheck(aggregateRoot){
    const persistedVersion = await eventModel.find({aggregateId: aggregateRoot.id}).select('aggregateVersion')
    if(aggregateRoot.version !== persistedVersion + 1) {
        const e = Error('The aggregate with aggregate root of type {aggregateRoot.GetType().Name} has been modified and the event stream cannot be appended.')
    }
}


