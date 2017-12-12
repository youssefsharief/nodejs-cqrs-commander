
function tooLong(str){
    e.type == 'tooLong'
    let e = new Error(`${str} could not be more than 100`)
    throw e
}

function nullOrWhiteSpace(str){
    e.type == 'nullOrWhiteSpace'
    let e = new Error(`${str} could not be null or whitespace`)
    throw e
}



module.exports = {
    tooLong, nullOrWhiteSpace
}
