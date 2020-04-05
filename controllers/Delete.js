
const handleDelete = (req, res, db) => {
    db('content').where({ id: req.body.id }).
        del()
        .then(res.json('borrado exitoso'))
}

module.exports = {
    handleDelete: handleDelete
}