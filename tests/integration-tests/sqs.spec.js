const publisher = require('../../src/messaging/publish-events')


describe("Users endpoint", function () {




    it('should pass', async (done) => {
        await publisher.publishEvent({ay:'ds'})
        done()
    })
})
