const { connectToDb } = require('../helpers/requestsSpecHelper')
const faker = require('faker')
const { handleApproveAccountCommand, handleCreateAccountCommand, handleDeleteAccountCommand, handleReinstateAccountCommand } = require('../../src/command-handlers/account-command-handler')
const generateId = require('../../src/services/id-generator').id
const winstonLogger = require('../../src/services/winston-logger')
winstonLogger.configure()

describe("Users endpoint", function () {

    afterAll(() => {
    })
    beforeAll(() => {
        connectToDb()
    })
    describe("Create Account", function () {
        const command = {
            accountNumber: 5652,
            accountId: generateId(),
            businessName: faker.name.firstName(),
        }



        it('should pass', async (done) => {
            expect(await handleCreateAccountCommand(command)).toBeTruthy()
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
            accountId,
        }


        it('should pass', async (done) => {
            expect(await handleCreateAccountCommand(createCommand)).toBeTruthy()
            expect(await handleDeleteAccountCommand(deleteCommand)).toBeTruthy()
            expect(await handleReinstateAccountCommand(reinstateAccount)).toBeTruthy()
            done()
        })

    })



    describe("Approve Account", function () {
        

        
        it('should approve account successfully', async (done) => {
            const createCommand = {
                accountNumber: 5652,
                accountId: generateId(),
                businessName: faker.name.firstName(),
            }
            const approveAccount = {
                approvedBy: 'dsd',
                accountId: createCommand.accountId,
            }
            expect(await handleCreateAccountCommand(createCommand)).toBeTruthy()
            expect(await handleApproveAccountCommand(approveAccount)).toBeTruthy()
            done()
        })

        it('should throw error if approved is blank', async (done) => {
            const createCommand = {
                accountNumber: 5652,
                accountId: generateId(),
                businessName: faker.name.firstName(),
            }
            const approveAccount = {
                approvedBy: 'dsd',
                accountId: createCommand.accountId,
            }
            expect(await handleCreateAccountCommand(createCommand)).toBeTruthy()
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