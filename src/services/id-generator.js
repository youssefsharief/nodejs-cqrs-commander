
const id = () => require('crypto').randomBytes(16).toString("hex")

module.exports = {id}