const router = require('express').Router()
const commandsConstants = require('../config/commands.constants')
const {handleApproveAccountCommand, handleCreateAccountCommand, handleDeleteAccountCommand, 
    handleReinstateAccountCommand, handleUpdateAccountAddressCommand} = require('../command-handlers/account-command-handler')
const {checkForError} = require('./response-error-finder')

router.post(`/${commandsConstants.deleteAccount}`, async (req, res) => {
    try {
        if(await handleDeleteAccountCommand(req.body))  return res.status(200).json('ok')
        else return res.status(500).json({error: 'An unknow error occurred'})
    } catch (err) { checkForError(res, err) }
})



router.post(`/${commandsConstants.approveAccount}`, async (req, res) => {
    try {
        if(await handleApproveAccountCommand(req.body))  return res.status(200).json('ok')
        else return res.status(500).json({error: 'An unknow error occurred'})
    } catch (err) { checkForError(res, err) }
})


router.post(`/${commandsConstants.createAccount}`, async (req, res) => {
    try {
        if(await handleCreateAccountCommand(req.body))  return res.status(200).json('ok')
        else return res.status(500).json({error: 'An unknow error occurred'})
    } catch (err) { checkForError(res, err) }
})


router.post(`/${commandsConstants.reinstateAccount}`, async (req, res) => {
    try {
        if(await handleReinstateAccountCommand(req.body))  return res.status(200).json('ok')
        else return res.status(500).json({error: 'An unknow error occurred'})
    } catch (err) { checkForError(res, err) }
})


router.post(`/${commandsConstants.updateAccountAddress}`, async (req, res) => {
    try {
        if(await handleUpdateAccountAddressCommand(req.body))  return res.status(200).json('ok')
        else return res.status(500).json({error: 'An unknow error occurred'})
    } catch (err) { checkForError(res, err) }
})


module.exports = router