const db = require('../database/write/db-ctrl')

const handlerDataLayer = (aggregateId) => ({
    previousEvents: [],
    snapshot: null,
    eventSequence: 0,
    aggregateVersion:0,

    async saveStateFromDb() {
        this.snapshot = await db.getLatestSnapShotByAggregateId(aggregateId)
        let query
        if (this.snapshot) {
            query = db.getSortedlastEventsOnly(aggregateId, this.snapshot.lastEventSequence)
        } else {
            query = db.getSortedAllAggregateEvents(aggregateId)
        }
        this.previousEvents = await query
        this.setVersioning()
    },

    setVersioning() {
        const lastEvent = this.previousEvents[this.previousEvents.length - 1]
        this.eventSequence = lastEvent ? lastEvent.eventSequence : 1
        this.aggregateVersion = lastEvent ? lastEvent.aggregateVersion : 1
    },


    async saveCommandActionsToDb(newEvents, aggregateAfterApplingCommand) {
        await db.concurrencyCheck(this.aggregateVersion, aggregateAfterApplingCommand.id)
        await db.saveEvents(newEvents)
        if (newEvents.findIndex(e => e.sequence % 10 === 0) >= 0)
            await db.saveSnapshot({ lastEventSequence: this.eventSequence, aggregateRootId: aggregateAfterApplingCommand.id, payload: aggregateAfterApplingCommand })
    }

})

module.exports = handlerDataLayer