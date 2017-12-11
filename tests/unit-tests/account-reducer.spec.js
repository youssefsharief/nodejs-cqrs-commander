const faker = require('faker')
const { getCurrentStateFromEventsAndLatestSnapshot } = require('../../src/services/account-after-events')
const domainEvents = require('../../src/config/events.constants').domainEvents

describe("Account Reducer ", function () {

    describe("Accessing a non created account with no snapshot", function () {
        const id = faker.lorem.word()
        const events = [
            { name: domainEvents.accountCreated, payload: { id: id, businessName: faker.name.firstName(), accountNumber: 56562 } },
            {
                name: domainEvents.accountAddressUpdated, payload: {
                    id: id, addressLine1: faker.address.streetName(),
                    addressLine2: faker.address.streetName(), city: faker.address.city(), state: faker.address.state(),
                    postcode: faker.address.zipCode(), countryName: faker.address.country()
                }
            },
            { name: domainEvents.accountDeleted, payload: { id: id, reason: 'beacuase he wants so' } },
            { name: domainEvents.accountReinstated, payload: { id: id } },
            { name: domainEvents.accountApproved, payload: { id: id, approvedBy: faker.name.firstName() } }
        ]
        it("should go through all events", function () {
            const currentAccount = getCurrentStateFromEventsAndLatestSnapshot(events, {})
            expect(currentAccount).toBeTruthy()
            expect(currentAccount.status.isApproved).toBe(true)
            expect(currentAccount.status.isDeleted).toBe(false)
        })

    })


    describe("Accessing a non created account with no snapshot ", function () {
        const id = faker.lorem.word()
        const events = [
            {
                name: domainEvents.accountAddressUpdated, payload: {
                    id: id, addressLine1: faker.address.streetName(), addressLine2: 'ds', city: faker.address.city(), state: faker.address.state(),
                    postcode: faker.address.zipCode(), countryName: faker.address.country()
                }
            },
            { name: domainEvents.accountDeleted, payload: { id: id, reason: 'beacuase he wants so' } },
            { name: domainEvents.accountReinstated, payload: { id: id } },
            { name: domainEvents.accountApproved, payload: { id: id, approvedBy: faker.name.firstName() } }
        ]
        it("should throw error", function () {
            try {
                getCurrentStateFromEventsAndLatestSnapshot(events, {})
            } catch (e) {
                expect(e).toBeTruthy()
            }

        })

    })


    describe("Accessing a non created account with a snapshot ", function () {
        const id = faker.lorem.word()
        const events = [
            {
                name: domainEvents.accountAddressUpdated, payload: {
                    id: id, addressLine1: faker.address.streetName(), addressLine2: 'ds', city: faker.address.city(), state: faker.address.state(),
                    postcode: faker.address.zipCode(), countryName: faker.address.country()
                }
            },
            { name: domainEvents.accountDeleted, payload: { id: id, reason: 'beacuase he wants so' } },
            { name: domainEvents.accountReinstated, payload: { id: id } },
            { name: domainEvents.accountApproved, payload: { id: id, approvedBy: faker.name.firstName() } }
        ]

        const aggregateState = { businessName: faker.name.firstName(), id: 'daew', accountNumber: 12545454, systemTags: [], status: {}, address: {} }
        it("process snapshotted aggregateState", function () {
            const currentAccount = getCurrentStateFromEventsAndLatestSnapshot(events, aggregateState)
            expect(currentAccount).toBeTruthy()
            expect(currentAccount.status.isApproved).toBe(true)
            expect(currentAccount.status.isDeleted).toBe(false)


        })

    })






})
