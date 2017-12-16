const joi = require('joi')
const defaultCommandHandling = require('./default-command-handling')
const logLocally = require('../services/local-logger-decorator').logLocally
const logOnCloud = require('../services/cloud-logger-decorator').logOnCloud
const commandsConstants = require('../config/commands.constants')
const validateId = require('../services/id-generator').validateId
const createAccountHandler = require('./create-account-handler').createAccountHandler

module.exports = {
    async handleCreateAccountCommand(command) {
        validateId(command.id)
        joi.assert(command.businessName, joi.string().min(2).max(10).required().label('Business Name'))
        joi.assert(command.accountNumber, joi.number().min(1000).max(10000).required().label('Account Number'))
        await logOnCloud(logLocally(createAccountHandler(command, commandsConstants.createAccount), commandsConstants.createAccount))()
    },
    
    async handleDeleteAccountCommand(command) {
        validateId(command.id)
        joi.assert(command.reason, joi.string().min(1).required().max(100).label('Delete reason'))
        await logOnCloud(logLocally(defaultCommandHandling(command, commandsConstants.deleteAccount), commandsConstants.deleteAccount))()
    },
    
    
    async handleApproveAccountCommand(command) {
        validateId(command.id)
        joi.assert(command.approvedBy, joi.string().min(1).max(100).label('Approved by'))
        await logOnCloud(logLocally(defaultCommandHandling(command, commandsConstants.approveAccount), commandsConstants.approveAccount))()
    },
    
    
    async handleUpdateAccountAddressCommand(command) {
        validateId(command.id)
        joi.assert(command.addressLine1, joi.string().required().max(100).label('Address Line 1'))
        joi.assert(command.addressLine2, joi.string().required().max(100).label('Address Line 2'))
        joi.assert(command.city, joi.string().required().max(100).label('City'))
        joi.assert(command.state, joi.string().required().max(100).label('State'))
        joi.assert(command.countryName, joi.string().required().max(100).label('Country'))
        joi.assert(command.postcode, joi.string().required().max(12).label('Post code'))
        await logOnCloud(logLocally(defaultCommandHandling(command, commandsConstants.updateAccountAddress), commandsConstants.updateAccountAddress))()
    },
    
    
    async handleReinstateAccountCommand(command) {
        validateId(command.id)
        await logOnCloud(logLocally(defaultCommandHandling(command, commandsConstants.reinstateAccount), commandsConstants.reinstateAccount))()
    },
    
}






