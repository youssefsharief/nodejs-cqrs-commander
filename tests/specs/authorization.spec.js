const account = require('../../src/entities/account')
const faker = require('faker')
const events = require('../../src/config/events.constants')
describe("Events ", function () {

    const accountEvents_FOR_1_Aggregate = [
        { name: events.accountCreated, payload: { accountId: 'jfkshduirydf', businessName: 'Omar', accountNumber: 56562 } },
        { name: events.accountAddressUpdated },
        { name: events.accountReinstated, },
        { name: events.accountApproved, payload: {accountId: 'dsdsd', approvedBy:'eeee'}}
    ]


    account.reinstated(
        account.addressUpdated(
            account.init(payload.accountId, payload.businessName, payload.accountNumber),
            payload.addressLine1, payload.addressLine2, payload.city, payload.postcode, payload.state, payload.countryName),
            payload

    )

    const accountAggregate = accountEvents_FOR_1_Aggregate.reduce((acc, x) => {
        switch (x.name) {
            case events.accountCreated:
                return account.init(x.payload.accountId, x.payload.businessName, x.payload.accountNumber)
            case events.accountApproved:
                return account.approved(acc, )
            case events.accountDeleted: acc.state = false
                return account.deleted(acc)
            case events.accountReinstated: acc.state = true
                return account.reinstated(acc)
            case 'accountAddressUpdated': acc.address = x.payload.address
                return acc
            default:
        }
    }, {})



    describe('allowed admin only', () => {
        const fn = authorize([admin], { selfAuthorized: false })
        it("should authorize admin successfully ", function () {
            const spyAuthorized = spyOn(toBeSpied, 'authorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '123', admin)
            fn(req, res, next)
            expect(spyAuthorized).toHaveBeenCalled()
        })

        it("should not authorize manager ", function () {
            const spyNotAuthorized = spyOn(toBeSpied, 'notAuthorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '1253', manager)
            fn(req, res, next)
            expect(spyNotAuthorized).toHaveBeenCalled()
        })


        it("should not authorize self ", function () {
            const spyNotAuthorized = spyOn(toBeSpied, 'notAuthorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '123', regular)
            fn(req, res, next)
            expect(spyNotAuthorized).toHaveBeenCalled()
        })

        it("should not authorize other user ", function () {
            const spyNotAuthorized = spyOn(toBeSpied, 'notAuthorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '13', regular)
            fn(req, res, next)
            expect(spyNotAuthorized).toHaveBeenCalled()
        })
    })



    describe('allowed admin and self only', () => {
        const fn = authorize([admin], { selfAuthorized: true })
        it("should authorize admin successfully ", function () {
            const spyAuthorized = spyOn(toBeSpied, 'authorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '1253', admin)
            fn(req, res, next)
            expect(spyAuthorized).toHaveBeenCalled()
        })

        it("should not authorize manager ", function () {
            const spyNotAuthorized = spyOn(toBeSpied, 'notAuthorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '1253', manager)
            fn(req, res, next)
            expect(spyNotAuthorized).toHaveBeenCalled()
        })


        it("should authorize self ", function () {
            const spyAuthorized = spyOn(toBeSpied, 'authorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '123', regular)
            fn(req, res, next)
            expect(spyAuthorized).toHaveBeenCalled()
        })

        it("should not authorize other user ", function () {
            const spyNotAuthorized = spyOn(toBeSpied, 'notAuthorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '13', regular)
            fn(req, res, next)
            expect(spyNotAuthorized).toHaveBeenCalled()
        })
    })


    describe('allowed manager and admin', () => {
        const fn = authorize([admin, manager], { selfAuthorized: false })
        it("should authorize admin successfully ", function () {
            const spyAuthorized = spyOn(toBeSpied, 'authorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '1253', admin)
            fn(req, res, next)
            expect(spyAuthorized).toHaveBeenCalled()
        })

        it("should authorize manager ", function () {
            const spyAuthorized = spyOn(toBeSpied, 'authorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '1253', manager)
            fn(req, res, next)
            expect(spyAuthorized).toHaveBeenCalled()
        })


        it("should not authorize self ", function () {
            const spyNotAuthorized = spyOn(toBeSpied, 'notAuthorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '123', regular)
            fn(req, res, next)
            expect(spyNotAuthorized).toHaveBeenCalled()
        })

        it("should not authorize other user ", function () {
            const spyNotAuthorized = spyOn(toBeSpied, 'notAuthorized')
            const res = new MockResponse()
            const req = new MockRequest('123', '13', regular)
            fn(req, res, next)
            expect(spyNotAuthorized).toHaveBeenCalled()
        })
    })









})

