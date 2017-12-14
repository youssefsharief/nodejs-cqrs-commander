const joi = require('joi')

const id = () => require('crypto').randomBytes(16).toString("hex")
const validateId = id => joi.assert(id, joi.string().min(6).max(16).required().label('ID'))

module.exports = {id, validateId}