function checkForError(res, err) {
    if (err.name=== 'ValidationError') {
        if(err.isJoi) return res.status(422).json({ errors: err.details })
        else res.status(400).json({error: 'A problem occurred while dealing with the database'})
    } else {
        if(err.message) return res.status(400).json({ error: err.message })
        else return res.status(500).json({ error: err })
    }
}

module.exports = {checkForError}