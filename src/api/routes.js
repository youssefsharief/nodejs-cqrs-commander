const router = require('express').Router()
const commandsConstants = require('../config/commands.constants')
const { handle } = require('../command-handlers/account-command-handlers')



Object.keys(commandsConstants).forEach((x) => {
    router.post(`/${x}`, (req, res) => {
        try {
            handle(x, req.body.command)
            return res.status(200).json('ok')
        } catch (err) {
            if (err.name === 'ValidationError' && err.isJoi) return res.status(422).json({ errors: err.details })
            return res.status(400).json({error:err.message})
        }
    })
});

module.exports = router