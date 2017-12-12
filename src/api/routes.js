const router = require('express').Router()
const commandsConstants = require('../config/commands.constants')
const logLocally = require('../services/local-logger-decorator').logLocally
const logOnCloud = require('../services/cloud-logger-decorator').logOnCloud


router.post(`/${commandsConstants.deleteAccount}`, async (req, res) => {
    try {
        await logOnCloud(logLocally(deleteAccountCommandHandler(commandsConstants.deleteAccount, req.body), commandsConstants.deleteAccount))()
        return res.status(200).json('ok')
    } catch (err) { checkForError(res, err) }
})



router.post(`/${commandsConstants.approveAccount}`, async (req, res) => {
    try {
        await logOnCloud(logLocally(handleFn(commandsConstants.approveAccount, req.body), commandsConstants.approveAccount))()
        return res.status(200).json('ok')
    } catch (err) { checkForError(res, err) }
})


router.post(`/${commandsConstants.createAccount}`, async (req, res) => {
    try {
        await logOnCloud(logLocally(handleFn(commandsConstants.createAccount, req.body), commandsConstants.createAccount))()
        return res.status(200).json('ok')
    } catch (err) { checkForError(res, err) }
})


router.post(`/${commandsConstants.reinstateAccount}`, async (req, res) => {
    try {
        await logOnCloud(logLocally(handleFn(commandsConstants.reinstateAccount, req.body), commandsConstants.reinstateAccount))()
        return res.status(200).json('ok')
    } catch (err) { checkForError(res, err) }
})


router.post(`/${commandsConstants.updateAccountAddress}`, async (req, res) => {
    try {
        await logOnCloud(logLocally(handleFn(commandsConstants.updateAccountAddress, req.body), commandsConstants.updateAccountAddress))()
        return res.status(200).json('ok')
    } catch (err) { checkForError(res, err) }
})


module.exports = router