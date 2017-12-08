function commandLogger(fn, commandName, command) {

    console.log(`Start executing command ${commandName}`)
    console.time('start command')

    try {
        fn(command)
    } catch (e) {
        console.error(`Exception throw while executing command ${commandName}  ${e.message}   ${e.type} - Time taken: ${console.timeEnd('start command')} `)
    } finally {
        console.timeEnd('start command')
    }

}

module.exports = {commandLogger}