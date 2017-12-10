

const requests= [
    {
        id: 'requestID', accountId: 'command.id',
        command: {
            payload: '(command)', commandName: 'approveAccount',
        }, 
        snapshot: {},
        eventsToBePlayed: [],
        eventsTobeStored: []
    }
]


function createNewRequest(requestId, command){
    requests.push({id:requestId, accountId: command.id, command:command, dateAdded: Date.now(), currentVersion:0})
}
// Hope that this could be injected anywhere in backend