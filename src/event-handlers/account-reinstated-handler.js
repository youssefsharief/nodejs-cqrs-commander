const commandhandlerEventEmitter  = require('../command-handlers')
const db = require('../database/write/db-ctrl')
const eventsConstants = require('../config/events.constants')
const domainBus = require('../services/domain-bus')

commandhandlerEventEmitter.on('accountReinstatedPersisted', async event =>{
    const allEvents = await db.getSortedAllAggregateEvents(event.aggregateId)
    if(allEvents.length) {
        const eventsToBePublished = allEvents.filter(e => 
            e.name !== eventsConstants.accountDeleted && 
            e.name !== eventsConstants.accountReinstated &&
            e.name !== eventsConstants.accountReinstated)

        eventsToBePublished.forEach(async e => {
            await domainBus.publish(e)
        });
    }
})


