const joi = require('joi')
var uuid = require('uuid');

const id = () => uuid.v4()
const validateId = id => joi.assert(id, joi.string().uuid())


module.exports = {id, validateId}