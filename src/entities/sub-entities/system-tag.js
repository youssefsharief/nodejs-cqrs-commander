const error = require('../../../Ximo/errors')

const setName = x => !x ? error.nullOrWhiteSpace('Name') : x


module.exports = (name, appliesToExpenses, appliesToTimesheets) => ({ name: setName(name), appliesToExpenses, appliesToTimesheets })
