const router = require('express').Router()
const commandsConstants = require('../config/commands.constants')
const { handle } = require('../command-handlers/account-command-handlers')



Object.keys(commandsConstants).forEach((x) => {
    router.post(`/${x}`, (req, res) => {
        try {
            handle(x, req.body.command)
            return res.status(200).json('ok')
        } catch(e) {
            return res.status(400).json('nah')
        }
    })
});

module.exports = router