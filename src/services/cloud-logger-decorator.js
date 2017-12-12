function logOnCloud(fn) {
    return async () => {
        console.log('Another Decorator')
        try {
            await fn()
        } catch (e) {
            throw e
        }
    }


}



module.exports = { logOnCloud }