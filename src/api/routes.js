const router = require('express').Router()
const commandsConstants = require('../config/commands.constants')
const { handle } = require('../command-handlers/account-command-handlers')


router.post(`/${commandsConstants.approveAccount}`, (req) => handle(commandsConstants.approveAccount, req.body.command))
router.post(`/${commandsConstants.reinstateAccount}`, (req) => handle(commandsConstants.reinstateAccount, req.body.command))
router.post(`/${commandsConstants.deleteAccount}`, (req) => handle(commandsConstants.deleteAccount, req.body.command))
router.post(`/${commandsConstants.createAccount}`, (req) => handle(commandsConstants.createAccount, req.body.command))
router.post(`/${commandsConstants.updateAccountAddress}`, (req) => handle(commandsConstants.updateAccountAddress, req.body.command))




module.exports = router