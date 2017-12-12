function logOnCloud(fn, commandName) {
    return async () => {
        console.log('Another Decorator', commandName)
        try {
            await fn()
        } catch (e) {
            throw e
        }
    }


}



module.exports = { logOnCloud }