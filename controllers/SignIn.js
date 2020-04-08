

const handleSignIn = (db, bcrypt) => (req, res) => {
    db.select('name' , 'hash').from('login')
    .where('name', '=', req.body.name)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
          return  db.select('*').from('users')
            .where('name', '=', req.body.name)
            .then(user => {
                res.json(user)
            })
            .catch(err => res.status(400).json('no se pudo encontar el usuario'))
        } else {
            res.json('quien es este impostor?')
        } 
    })
}

module.exports = {
    handleSignIn: handleSignIn
}