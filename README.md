

1. npm install 
2. npm start



Only if you are going to setup the database you would need to do the following
1. This command need to be added if a new mongo database is used to ensure consistency and order
db.getCollection('events').ensureIndex( { "aggregateId": 1, "eventSequence": 1 }, { unique: true } )

2. Run this command for tailable cursor so that the event store would act like consumer driven queue
db.runCommand({"convertToCapped": "events", size: 500000000000});
