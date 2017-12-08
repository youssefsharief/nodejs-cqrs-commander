const account = require('../../src/entities/account')
const faker = require('faker')
const events = require('../../src/config/events.constants')
fdescribe("Events ", function () {

    const accountEvents_FOR_1_Aggregate = [
        { name: events.accountCreated, payload: { accountId: 'jfkshduirydf', businessName: 'Omar', accountNumber: 56562 } },
        { name: events.accountAddressUpdated, payload: { accountId: 'jfkshduirydf', addressLine1: 'ssss', addressLine2: 'ds', city: 'fd', state: 'CA', postcode: '12354', countryName: 'sccc' } },
        { name: events.accountDeleted, payload: { accountId: 'jfkshduirydf', reason: 'beacuase he wants so' } },
        { name: events.accountReinstated, payload: { accountId: 'jfkshduirydf' } },
        { name: events.accountApproved, payload: { accountId: 'dsdsd', approvedBy: 'eeee' } }
    ]



    const accountAggregate = accountEvents_FOR_1_Aggregate.reduce((acc, e) => {
        switch (e.name) {
            case events.accountCreated: return account.init(e.payload.accountId, e.payload.businessName, e.payload.accountNumber)
            case events.accountApproved: return account.applyApprove(acc, e.payload)
            case events.accountDeleted: return account.applyDelete(acc, e.payload)
            case events.accountReinstated: return account.applyReinstate(acc, e.payload)
            case events.accountAddressUpdated: return account.applyChangeAddress(acc, e.payload)
            case events.systemTagAdded: return account.applyAddSytemTag(acc, e.payload)
        }
    }, {})


    

    it("should have account ", function () {
        console.log(accountAggregate)
        expect(accountAggregate).toBeTruthy()
    })

    
})

