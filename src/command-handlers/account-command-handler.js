const InternalEventsModule = require('./internal-events')
const DataLayer = require('./command-initial-db-query')
const applyPreviousEventsToAggregate = require('./map-account-from-previous-events').accountAfterApplyingEvents
const aggregateAfterApplyingCommand = require('./account-after-command').accountAfterCommand
const events = require('events');
const eventEmitter = new events.EventEmitter();
const domainBus = require('../services/domain-bus')


function handleCreateAccountCommand(command, commandName) {
    validateCreateCommandPayload(command)
    
    const dataLayer = DataLayer(command.id)
    dataLayer.saveStateFromDb()
    const aggregateAfterApplyingPastEventsButBeforeApplyingCommand = applyPreviousEventsToAggregate(dataLayer.previousEvents, dataLayer.snapshot ? dataLayer.snapshot.payload : null)
    const internalEventsModule = InternalEventsModule(command.id, dataLayer.eventSequence, dataLayer.aggregateVersion) 
    internalEventsModule.listen()
    const aggregateAfterCommand = aggregateAfterApplyingCommand(aggregateAfterApplyingPastEventsButBeforeApplyingCommand, command, commandName)
    const newEvents =  internalEventsModule.getInternalEvents()
    dataLayer.saveCommandActionsToDb(newEvents, aggregateAfterCommand )
    newEvents.forEach(event => {
        eventEmitter.emit(`${event.name}Persisted`, event)
        domainBus.publish(event)
    })
    

}

