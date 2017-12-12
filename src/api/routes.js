const router = require('express').Router()
const commandsConstants = require('../config/commands.constants')
const handleFn  = require('../command-handlers/account-command-handlers').handle
const logLocally = require('../services/local-logger-decorator').logLocally
const logOnCloud = require('../services/cloud-logger-decorator').logOnCloud


Object.keys(commandsConstants).forEach( commandName => {
    router.post(`/${commandName}`, async(req, res) => {        
        try {
            await logOnCloud(logLocally(handleFn(commandName, req.body), commandName), commandName)()
            return res.status(200).json('ok')
        } catch (err) {
            if (err.name === 'ValidationError' && err.isJoi) return res.status(422).json({ errors: err.details })
            return res.status(400).json({error:err.message})
        }
    })
});

module.exports = router