const db = require('../core/mongo-interaction')


async function ESLogic(){
    const snapshot = await db.getLatestSnapShotByAggregateId(id)
    db.findLatestEventById
    db.getEventsAfterTheSnaphot()
}
