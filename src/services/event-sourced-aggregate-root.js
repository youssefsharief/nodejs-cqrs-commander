// O(1) time-complexity queue
const queue = require('rapid-queue')

class EventSourcedAggregateRoot {
    constructor() {
        _uncommittedEvents = new queue()
        this.version = 0;
        this.lastEventSequence = 0;
    }
    
    get uncommittedEvents() { return this._uncommittedEvents}

    markAsCommitted()
    {
        this._uncommittedEvents= new queue();
    }

    replay(historicalEvents)
    {
        historicalEvents.sort((a,b)=> a.sequence-b.sequence)

        historicalEvents.foreach(eventWrapper=>{
            applyEvent(eventWrapper.event)
            this.lastEventSequence = eventWrapper.sequence
            this.version = eventWrapper.aggregateVersion;
        })
    }

   