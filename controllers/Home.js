

const handleHome = (req, res, db) => {
    db.select().table('content')
    .then(response => {
        res.json(response);
    })
}

module.exports = {
    handleHome: handleHome
}