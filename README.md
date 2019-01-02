

1. npm install 
2. npm start



Only if you are going to setup the database you would need to do the following
* To ensure consistency and order
`db.getCollection('events').ensureIndex( { "aggregateId": 1, "eventSequence": 1 }, { unique: true } )`

* For a tailable cursor so that the event store would act like a consumer driven queue
`db.runCommand({"convertToCapped": "events", size: 500000000000});`
