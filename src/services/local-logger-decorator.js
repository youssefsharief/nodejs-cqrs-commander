function logLocally(fn, commandName) {
    return async () => {
        console.log(`Start executing command ${commandName}`)
        console.time('Time taken to execute command')
        try {
            const res = await fn()
            console.timeEnd('Time taken to execute command')
            return res
        } catch (e) {
            console.error(`Exception throw while executing command ${commandName}  ${e.message} `)
            console.timeEnd('Time taken to execute command')
            // console.log(e.stack)
            throw e
        }
    }
    

}



module.exports = { logLocally }
