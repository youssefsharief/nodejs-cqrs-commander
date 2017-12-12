const router = require('express').Router()
const commandsConstants = require('../config/commands.constants')
const { handle } = require('../command-handlers/account-command-handlers')



Object.keys(commandsConstants).forEach( commandName => {
    router.post(`/${commandName}`, async(req, res) => {
        try {
            await handle(commandName, req.body)
            return res.status(200).json('ok')
        } catch (err) {
            if (err.name === 'ValidationError' && err.isJoi) return res.status(422).json({ errors: err.details })
            return res.status(400).json({error:err.message})
        }
    })
});

module.exports = router