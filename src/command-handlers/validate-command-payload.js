

const joi = require('joi')

function validateCreateCommandPayload(command) {
    joi.assert(command.businessName, joi.string().min(2).max(10).required().label('Business Name'))
    joi.assert(command.accountNumber, joi.number().min(1000).max(10000).required().label('Business Name'))
}



