const { connectToDb } = require('../helpers/requestsSpecHelper')
const faker = require('faker')
const { handleApproveAccountCommand, handleCreateAccountCommand, handleDeleteAccountCommand, handleReinstateAccountCommand } = require('../../src/command-handlers/account-command-handler')
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
            await handleCreateAccountCommand(command)
            done()
        })
    })



    describe("Reinstate Account", function () {
        const accountId = generateId()
        const createCommand = {
            accountNumber: 5652,
            accountId,
            businessName: faker.name.firstName(),
        }

        const deleteCommand = {
            reason: 'dsd',
            accountId,
        }

        const reinstateAccount = {
            reason: 'dsd',
            accountId,
        }


        it('should pass', async (done) => {
            await handleCreateAccountCommand(createCommand)
            await handleDeleteAccountCommand(deleteCommand)
            await handleReinstateAccountCommand(reinstateAccount)
            done()
        })

    })



    describe("Approve Account", function () {
        const accountId = generateId()
        const createCommand = {
            accountNumber: 5652,
            accountId,
            businessName: faker.name.firstName(),
        }

        const approveAccount = {
            approvedBy: 'dsd',
            accountId,
        }
        it('should approve account successfully', async (done) => {
            await handleCreateAccountCommand(createCommand)
            await handleApproveAccountCommand(approveAccount)
            done()
        })

        it('should throw error if approved is blank', async (done) => {
            await handleCreateAccountCommand(createCommand)
            approveAccount.approvedBy = ''
            try {
                await handleApproveAccountCommand(approveAccount)
            } catch (e) {
                expect(e).toBeTruthy()
                done()
            }
        })

    })


})