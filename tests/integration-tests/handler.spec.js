const { connectToDb } = require('../helpers/requestsSpecHelper')
const faker = require('faker')
const handle = require('../../src/command-handlers/account-command-handlers').handle
const commandConstants = require('../../src/config/commands.constants')

describe("Users endpoint", function () {

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