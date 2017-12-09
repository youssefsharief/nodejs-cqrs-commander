

async function getAggregateEvents(aggregateId) {
    return await retP().catch(err=> {
        throw Error(err)
    })
}



function retP () {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('eeeeeeeehhhhh')
        },1000)
    })
}

async function aykalam () {
    let t = await getAggregateEvents('dfd')
    t
}


aykalam()
