function logLocally(fn, commandName) {
    return async () => {
        console.log(`Start executing command ${commandName}`)
        console.time('Time taken to execute command')
        try {
            await fn()
            console.timeEnd('Time taken to execute command')
        } catch (e) {
            console.error(`Exception throw while executing command ${commandName}  ${e.message} `)
            console.timeEnd('Time taken to execute command')
            throw e
        }
    }
    

}



module.exports = { logLocally }
