const { connectToDb } = require('../helpers/requestsSpecHelper')
const faker = require('faker')
let server, request
const handle = require('../../src/command-handlers/account-command-handlers').handle
const commandHanlderEventEmitter = require('../../src/command-handlers/account-command-handlers').eventEmitter
const commandConstants = require('../../src/config/commands.constants')

fdescribe("Users endpoint", function () {

    describe("Create Account", function () {
        const command = {
            accountNumber: 5652,
            id: '11111',
            businessName: faker.name.firstName(),
        }

        beforeAll(() => {
            connectToDb()
        })

        it('sd', async(done)=>{
            await handle(commandConstants.createAccount, command)
            done()
        })

    



       
    })

})