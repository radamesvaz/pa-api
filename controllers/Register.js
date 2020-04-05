
const handleRegister = (req, res, db, bcrypt) => {
    const { name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            name: name,
            hash: hash
        })
        .into('login')
        .returning('name')
        .then(loginName => {
            return trx('users')
            .returning('*')
            .insert({
                name: loginName[0],
                hash: hash
        })
        .then(user => {
            res.json('registrado con exito');
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('no se pudo registrar'));
    
};

module.exports = {
    handleRegister: handleRegister
}