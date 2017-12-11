const { connectToDb } = require('../helpers/requestsSpecHelper')
const faker = require('faker')
const handle = require('../../src/command-handlers/account-command-handlers').handle
const commandConstants = require('../../src/config/commands.constants')
const generateId = require('../../src/services/id-generator').id
const db = require('../../src/database/write/db-ctrl')

describe("Users endpoint", function () {

    afterAll(() => {
        db.removeAllEvents()
    })
    beforeAll(() => {
        connectToDb()
    })
    describe("Create Account", function () {
        const command = {
            accountNumber: 5652,
            id: '11111',
            businessName: faker.name.firstName(),
        }



        it('should pass', async (done) => {
            await handle(commandConstants.createAccount, command)
            done()
        })
    })



    describe("Reinstate Account", function () {
        const id = generateId()
        const createCommand = {
            accountNumber: 5652,
            id: id,
            businessName: faker.name.firstName(),
        }

        const deleteCommand = {
            reason: 'dsd',
            id: id,
        }

        const reinstateAccount = {
            reason: 'dsd',
            id: id,
        }


        it('should pass', async (done) => {
            await handle(commandConstants.createAccount, createCommand)
            await handle(commandConstants.deleteAccount, deleteCommand)
            await handle(commandConstants.reinstateAccount, reinstateAccount)
            done()
        })

    })



    describe("Approve Account", function () {
        const id = generateId()
        const createCommand = {
            accountNumber: 5652,
            id: id,
            businessName: faker.name.firstName(),
        }

        const approveAccount = {
            approvedBy: 'dsd',
            id: id,
        }
        it('should approve account successfully', async (done) => {
            await handle(commandConstants.createAccount, createCommand)
            await handle(commandConstants.approveAccount, approveAccount)
            done()
        })

        it('should throw error if approved is blank', async (done) => {
            await handle(commandConstants.createAccount, createCommand)
            approveAccount.approvedBy=''
            try{
                await handle(commandConstants.approveAccount, approveAccount)
            } catch(e) {
                expect(e).toBeTruthy()
                done()
            }
        })

    })


})