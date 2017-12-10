const commandsConstants = require('../config/commands.constants')
const accountEntity = require('../entities/account')

const commandFunctionMapper = new Map()
commandFunctionMapper.set(commandsConstants.approveAccount, accountEntity.approve)
commandFunctionMapper.set(commandsConstants.createAccount, accountEntity.create)
commandFunctionMapper.set(commandsConstants.deleteAccount, accountEntity.deleteAccount)
commandFunctionMapper.set(commandsConstants.reinstateAccount, accountEntity.reinstate)
commandFunctionMapper.set(commandsConstants.updateAccountAddress, accountEntity.changeAddress)

module.exports = commandFunctionMapper