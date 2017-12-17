const faker = require('faker')
const accountAfterApplyingEvents = require('../../src/command-handlers/map-account-from-previous-events').accountAfterApplyingEvents
const domainEvents = require('../../src/config/events.constants').domainEvents
const generateId = require('../../src/services/id-generator').id

describe("Account Reducer ", function () {

    describe("Accessing an account with no snapshot", function () {
        const accountId = generateId()
        const events = [
            { name: domainEvents.accountCreated, payload: { accountId, businessName: faker.name.firstName(), accountNumber: 56562 } },
            {
                name: domainEvents.accountAddressUpdated, payload: {
                    accountId, addressLine1: faker.address.streetName(),
                    addressLine2: faker.address.streetName(), city: faker.address.city(), state: faker.address.state(),
                    postcode: faker.address.zipCode(), countryName: faker.address.country()
                }
            },
            { name: domainEvents.accountDeleted, payload: { accountId, reason: 'beacuase he wants so' } },
            { name: domainEvents.accountReinstated, payload: { accountId } },
            { name: domainEvents.accountApproved, payload: { accountId, approvedBy: faker.name.firstName() } }
        ]
        it("should go through all events", function () {
            const currentAccount = accountAfterApplyingEvents(events, {})
            expect(currentAccount).toBeTruthy()
            expect(currentAccount.status.isApproved).toBe(true)
            expect(currentAccount.status.isDeleted).toBe(false)
        })

    })


    describe("Accessing a non created account with no snapshot ", function () {
        const accountId = generateId()
        const events = [
            {
                name: domainEvents.accountAddressUpdated, payload: {
                    accountId, addressLine1: faker.address.streetName(), addressLine2: 'ds', city: faker.address.city(), state: faker.address.state(),
                    postcode: faker.address.zipCode(), countryName: faker.address.country()
                }
            },
            { name: domainEvents.accountDeleted, payload: { accountId, reason: 'beacuase he wants so' } },
            { name: domainEvents.accountReinstated, payload: { accountId } },
            { name: domainEvents.accountApproved, payload: { accountId, approvedBy: faker.name.firstName() } }
        ]
        it("should throw error", function () {
            try {
                accountAfterApplyingEvents(events, {})
            } catch (e) {
                expect(e).toBeTruthy()
            }

        })

    })


    describe("Accessing a non created account with a snapshot ", function () {
        const accountId = generateId()
        const events = [
            {
                name: domainEvents.accountAddressUpdated, payload: {
                    accountId, addressLine1: faker.address.streetName(), addressLine2: 'ds', city: faker.address.city(), state: faker.address.state(),
                    postcode: faker.address.zipCode(), countryName: faker.address.country()
                }
            },
            { name: domainEvents.accountDeleted, payload: { accountId, reason: 'beacuase he wants so' } },
            { name: domainEvents.accountReinstated, payload: { accountId } },
            { name: domainEvents.accountApproved, payload: { accountId, approvedBy: faker.name.firstName() } }
        ]

        const aggregateState = { businessName: faker.name.firstName(), id: 'daew', accountNumber: 12545454, systemTags: [], status: {}, address: {} }
        it("process snapshotted aggregateState", function () {
            const currentAccount = accountAfterApplyingEvents(events, aggregateState)
            expect(currentAccount).toBeTruthy()
            expect(currentAccount.status.isApproved).toBe(true)
            expect(currentAccount.status.isDeleted).toBe(false)
        })

    })






})
