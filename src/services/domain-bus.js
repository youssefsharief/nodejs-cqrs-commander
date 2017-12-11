const {publishEvent} = require('../messaging/publish-events')
// const commandHandlerEventEmitter= require('../command-handlers/account-command-handlers').eventEmitter
// const domainEvents = require('../config/events.constants').domainEvents

async function publish(e) {
    return await publishEvent(e)
}
// console.log(commandHandlerEventEmitter)

// Object.keys(domainEvents).forEach(eventName => {
//     commandHandlerEventEmitter.on(`${eventName}Persisted`, (payload)=>{
//         return publish(payload)
//     })
// })


module.exports = {publish}