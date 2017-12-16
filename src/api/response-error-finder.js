function checkForError(res, err) {
    if (err.name === 'ValidationError' && err.isJoi) return res.status(422).json({ errors: err.details })
    return res.status(400).json({ error: err.message })
}

module.exports = {checkForError}