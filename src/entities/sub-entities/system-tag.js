const joi = require('joi')

const setName = x => {
    joi.assert(x, joi.string().required().min(1))
    return x
}

const setRequiredBool = x => {
    joi.assert(x, joi.bool().required())
    return x
}

module.exports = (name, appliesToExpenses, appliesToTimesheets) => ({ name: setName(name), appliesToExpenses: setRequiredBool(appliesToExpenses), 
    appliesToTimesheets: setRequiredBool(appliesToTimesheets) })
