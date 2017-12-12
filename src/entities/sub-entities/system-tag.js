const joi = require('joi')

const setName = x => {
    joi.assert(x, joi.string().required().min(1).label('name'))
    return x
}

const setRequiredBool = x => {
    joi.assert(x, joi.bool().required().label('applies'))
    return x
}

module.exports = (name, appliesToExpenses, appliesToTimesheets) => ({ name: setName(name), appliesToExpenses: setRequiredBool(appliesToExpenses), 
    appliesToTimesheets: setRequiredBool(appliesToTimesheets) })
