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

    applyChange(event)
    {
        ApplyEvent(event);

        if (!this._isDirty)
        {
            this.version = ++this.version;
            this._isDirty = true;
        }

        var domainEventEnvelope = new DomainEventEnvelope(Id, ++LastEventSequence, Version, event);
        this._uncommittedEvents.push(domainEventEnvelope);
    }
}


    let _isDirty
    let version
    
function applyChange(aggregate, fn, event ){
    applyEvent(aggregate, fn,event)
}

function applyEvent(aggregate, fn,event) {
    try{
        fn(event)
    } catch(e) {
        throw Error(e)
    }
    
}


