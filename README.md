This command need to be added if a new mongo database is used to ensure consistency and order
db.getCollection('events').ensureIndex( { "aggregateId": 1, "eventSequence": 1 }, { unique: true } )

Run this command for tailable cursor so that the event store would act like consumer driven queue
db.runCommand({"convertToCapped": "events", size: 500000000000});
