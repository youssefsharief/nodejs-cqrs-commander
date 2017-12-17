function logOnCloud(fn) {
    return async () => {
        console.log('Another Decorator')
        try {
            return await fn()
        } catch (e) {
            throw e
        }
    }


}



module.exports = { logOnCloud }