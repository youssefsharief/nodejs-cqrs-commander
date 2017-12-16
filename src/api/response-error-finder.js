function checkForError(res, err) {
    if (err.name=== 'ValidationError') {
        if(err.isJoi) return res.status(422).json({ errors: err.details })
        else res.status(400).json({error: 'A problem occurred while dealing with the database'})
    }    
    else return res.status(400).json({ error: err.message })
}

module.exports = {checkForError}