const faker = require('faker')
const accountEntity = require('../../src/entities/account')
const eventsConstants = require('../../src/config/events.constants')

describe("Account ", function () {

    describe("Creating Account ", function () {
        // it("should emit 3 events for vreating account and adding 3 system tags ", function () {
        //     let i = 0
        //     const eventsExpected = [eventsConstants.accountCreated, eventsConstants.systemTagAdded, eventsConstants.systemTagAdded, eventsConstants.systemTagAdded]
        //     accountEntity.eventEmitter.on(eventsConstants.internallyDone, (eventName, eventPayload) => {
        //         expect(eventName).toBe(eventsExpected[i])
        //         if(i===eventsExpected.length - 1) {
        //             accountEntity.eventEmitter.removeAllListeners() 
        //             return
        //         }
        //         i++
        //     })
            
        //     const newAccount = accountEntity.create(null, faker.name.firstName(), faker.commerce.price(1000, 1000))
        // })

        it("should create account with proper properties", function () {
            const newAccount = accountEntity.create(null, faker.name.firstName(), faker.commerce.price(1000, 1000))
            expect(newAccount).toBeTruthy()
            expect(newAccount.businessName).toBeTruthy()
            expect(newAccount.accountNumber).toBeTruthy()
            expect(newAccount.id).toBeTruthy()
            expect(newAccount.systemTags.length).toBe(3)
        })

        it("should emit error if account number is not supplied", function () {
            try{
                accountEntity.create(null, faker.name.firstName())
            } catch(e) {
                expect(e).toBeTruthy()
                expect(e.name).toBe('ValidationError')
            }
        })

        it("should emit error if business name is not supplied", function () {
            try{
                accountEntity.create(null, null, faker.commerce.price(1000, 1000))
            } catch(e) {
                expect(e).toBeTruthy()
                expect(e.name).toBe('ValidationError')
            }
        })

    })


    describe("Deleting Account ", function () {
        let newAccount
        beforeEach(()=>{
            newAccount = accountEntity.create(null, faker.name.firstName(), faker.commerce.price(1000, 1000))
        })

        // it("should emit account deleted event ", function () {
        //     let i = 0
        //     const eventsExpected = [eventsConstants.accountCreated, eventsConstants.systemTagAdded, eventsConstants.systemTagAdded, eventsConstants.systemTagAdded, eventsConstants.accountDeleted]
        //     accountEntity.eventEmitter.on(eventsConstants.internallyDone, (eventName, eventPayload) => {
        //         expect(eventName).toBe(eventsExpected[i])
        //         if(i===eventsExpected.length - 1) {
        //             accountEntity.eventEmitter.removeAllListeners() 
        //             return
        //         }
        //         i++
                
        //     })
            
        // })

        it("should delete account with proper properties", function () {
            const afterDeleteAccount = accountEntity.deleteAccount(newAccount, faker.lorem.sentence(10))
            expect(afterDeleteAccount.status.isDeleted).toBe(true)
        })

        it("should not delete a previously deleted account", function () {
            const afterDeleteAccount = accountEntity.deleteAccount(newAccount, faker.lorem.sentence(10))
            try {
                accountEntity.deleteAccount(afterDeleteAccount, faker.lorem.sentence(10))
            }catch(e){
                expect(e).toBeTruthy()
            }
        })
    })


    describe("Approving account ", function () {
        let newAccount
        beforeEach(()=>{
            newAccount = accountEntity.create(null, faker.name.firstName(), faker.commerce.price(1000, 1000))
        })
        it("should approve event successfully ", function () {
            const acc = accountEntity.approve(newAccount, faker.lorem.word('sd'))
            expect(acc.status.isApproved).toBe(true)
        })
        it("should not approve if approvedBy is not inputted ", function () {
            try {
                accountEntity.approve(newAccount, null)
            }catch(e){
                expect(e).toBeTruthy()
            }
        })

    })


    describe("Reinstating account ", function () {
        let newAccount
        beforeEach(()=>{
            newAccount = accountEntity.create(null, faker.name.firstName(), faker.commerce.price(1000, 1000))
        })
        it("should reinstate successfully ", function () {
            const afterDeleteAccount = accountEntity.deleteAccount(newAccount, faker.lorem.sentence(10))
            const acc = accountEntity.reinstate(afterDeleteAccount)
            expect(acc).toBeTruthy()
        })
        it("should not reinstate a an undeleted account ", function () {
            try {
                accountEntity.reinstate(newAccount)
            }catch(e){
                expect(e).toBeTruthy()
            }
        })

    })



    describe("Changing address ", function () {
        let newAccount
        beforeEach(()=>{
            newAccount = accountEntity.create(null, faker.name.firstName(), faker.commerce.price(1000, 1000))
        })
        it("should change address successfully ", function () {
            const acc = accountEntity.changeAddress(newAccount, faker.lorem.words(2), faker.lorem.words(2), faker.lorem.words(1)
            , faker.lorem.words(1), faker.lorem.words(1), faker.lorem.words(1))
            expect(acc).toBeTruthy()
        })
        it("should not change address if some address data is missing ", function () {
            try {
                accountEntity.changeAddress(newAccount, faker.lorem.words(2), faker.lorem.words(2),)
            }catch(e){
                expect(e).toBeTruthy()
            }
        })

    })



})
