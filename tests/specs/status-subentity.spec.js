const faker = require('faker')
const statusSubEntity = require('../../src/entities/sub-entities/status')

describe("status subentity ", function () {

    it("should get back status ", function () {
        const status = statusSubEntity(true, faker.name.firstName(), true, faker.lorem.word(1))
        expect(status).toBeTruthy()
    })


    it("should throw error if deleted reason is too long ", function () {
        try {
            statusSubEntity(true, faker.name.firstName(), true, faker.lorem.paragraph(10))
        } catch (e) {
            expect(e).toBeTruthy()
        }
    })



    it("should throw error if send incomplete data ", function () {
        try {
            statusSubEntity(true, false)
        } catch (e) {
            expect(e).toBeTruthy()
        }

    })


})

