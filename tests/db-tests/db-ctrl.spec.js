require('dotenv').config()
const faker = require('faker')
const domainEvents = require('../../src/config/events.constants').domainEvents
const crypto = require('crypto')
const mongoose = require("mongoose")
mongoose.Promise = global.Promise;
const db = require('../../src/database/write/db-ctrl')
const dbConnection = require('../../src/database/write/db-connection.js')

describe("Db Event store ", function () {
    beforeAll(async () => {
        dbConnection.connectToTestDb()
        await db.removeAllEvents()
    })

    afterAll(async () => {
        await db.removeAllEvents()
    })


    describe("Creating a new aggregate", function () {
        const aggregateId = crypto.randomBytes(16).toString("hex")
        beforeAll(async () => {
            const eventsToBeSaved = [
                {
                    id: crypto.randomBytes(16).toString("hex"),
                    name: domainEvents.accountCreated,
                    aggregateId,
                    payload: { id: aggregateId, businessName: faker.name.lastName(), accountNumber: 12345 },
                    eventSequence: 1,
                    aggregateVersion: 1
                },
                {
                    id: crypto.randomBytes(16).toString("hex"),
                    name: domainEvents.systemTagAdded,
                    aggregateId,
                    payload: { name: faker.lorem.word(), appliesToExpenses: true, appliesToTimesheets: false },
                    eventSequence: 2,
                    aggregateVersion: 1
                },
                {
                    id: crypto.randomBytes(16).toString("hex"),
                    name: domainEvents.systemTagAdded,
                    aggregateId,
                    payload: { name: faker.lorem.word(), appliesToExpenses: true, appliesToTimesheets: false },
                    eventSequence: 3,
                    aggregateVersion: 1
                },
                {
                    id: crypto.randomBytes(16).toString("hex"),
                    aggregateId,
                    name: domainEvents.systemTagAdded,
                    payload: { name: faker.lorem.word(), appliesToExpenses: true, appliesToTimesheets: false },
                    eventSequence: 4,
                    aggregateVersion: 1
                },]
            await db.saveEvents(eventsToBeSaved)
        })
        it("should create a new aggregate and return them sorted", async function () {
            const events = await db.getSortedAllAggregateEvents(aggregateId)
            expect(events[0].eventSequence).toBe(1)
            expect(events[1].eventSequence).toBe(2)
            expect(events[2].eventSequence).toBe(3)
            expect(events[3].eventSequence).toBe(4)
        })

        it("should pass concurrency check if version is 1", async function () {
            await db.concurrencyCheck(aggregateId, 1)
        })

        it("should fail concurrency check if version is 2", async function () {
            try {
                await db.concurrencyCheck(aggregateId, 2)
            } catch (e) {
                expect(e).toBeTruthy()
            }
        })

     

        it("should not be able to save snapshot if missing last event sequence", async function () {
            try {
                await db.saveSnapshot({ aggregateRootId: aggregateId, payload: {} })
            } catch (e) {
                expect(e).toBeTruthy()
            }
        })

        it("should be able to save snapshot and get latest snapshot", async function () {
            await db.saveSnapshot({ lastEventSequence: 4, aggregateRootId: aggregateId, payload: { accountNumber: 1234 } })
            const snapshot = await db.getLatestSnapShotByAggregateId(aggregateId)
            expect(snapshot.lastEventSequence).toBe(4)
            expect(snapshot.aggregateRootId).toBe(aggregateId)
            expect(snapshot.payload.accountNumber).toBe(1234)
        })

        it("should throw error if tried to get latest snapshot with having providing id", async function () {
            await db.saveSnapshot({ lastEventSequence: 4, aggregateRootId: aggregateId, payload: {} })
            try {
                await db.getLatestSnapShotByAggregateId(null)
            } catch (e) {
                expect(e).toBeTruthy()
            }
        })

        describe(('Saveing new sets of events after saving snapshot'), () => {
            const snapshot = { lastEventSequence: 4, aggregateRootId: aggregateId, payload: { accountNumber: 1234 } }

            beforeAll(async () => {
                await db.saveSnapshot(snapshot)
                const newEventsToBeSaved = [
                    {
                        id: crypto.randomBytes(16).toString("hex"),
                        name: domainEvents.accountDeleted,
                        aggregateId,
                        payload: { reason: 'banana is mooz' },
                        eventSequence: 5,
                        aggregateVersion: 2
                    },
                    {
                        id: crypto.randomBytes(16).toString("hex"),
                        name: domainEvents.accountReinstated,
                        aggregateId,
                        payload: {  },
                        eventSequence: 6,
                        aggregateVersion: 3
                    },]
                await db.saveEvents(newEventsToBeSaved)
            })



            it("should be able to get only aggregate events after snapshot", async function () {
                const newEventsOnly = await db.getSortedlastEventsOnly(snapshot.aggregateRootId, snapshot.lastEventSequence)
                expect(newEventsOnly.length).toBe(2)
            })

        })








        it("should emit error if event name is not there", async function () {
            const aggregateId = crypto.randomBytes(16).toString("hex")
            const eventsToBeSaved = [
                {
                    id: crypto.randomBytes(16).toString("hex"),
                    aggregateId,
                    payload: { id: aggregateId, businessName: faker.name.lastName(), accountNumber: 12345 },
                    eventSequence: 1,
                    aggregateVersion: 1
                },
            ]

            try {
                await db.saveEvents(eventsToBeSaved)
            } catch (e) {
                expect(e).toBeTruthy()
            }
        })
    })


    describe("Accessing a non created account with no snapshot ", function () {



    })


    describe("Accessing a non created account with a snapshot ", function () {





    })






})
