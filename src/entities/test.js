function addSystemTag(account, name, appliesToExpenses, appliesToTimesheets) {
        if (account.systemTags.find(x => x.name === name)) throw new Error('ss')
        else {
            doAddSystemTag(account, name, appliesToExpenses, appliesToTimesheets)
            return (account)
        }
}

function doAddSystemTag(account, name, appliesToExpenses, appliesToTimesheets) {
    account.systemTags.push({ name, appliesToExpenses, appliesToTimesheets })
}

let account = {systemTags:[]}

let x = addSystemTag(account, 'ds', true , true)

x
