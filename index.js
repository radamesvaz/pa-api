const express = require('express');
const bodyParser = require('body-parser');
const upload = require('./multer');
const cloudinary = require('./cloudinary');
const fs = require('fs');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'planetaaccesorios'
    }
  });



const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const databaseUser = {
    usuario: [
    {      
        user: 'radames',
        password: 'cookies'
    }]
}


app.post('/signin', (req,res) => {
    db.select('name' , 'hash').from('login')
    .where('name', '=', req.body.name)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
          return  db.select('*').from('users')
            .where('name', '=', req.body.name)
            .then(user => {
                res.json('acceso garantizado')
            })
            .catch(err => res.status(400).json('no se pudo encontar el usuario'))
        } else {
            res.json('quien es este impostor?')
        } 
    })
})


app.post('/register', (req, res) => {
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
    
})

// Image uploader

app.use('/upload-images', upload.array('image'), async(req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Images');
    if (req.method === 'POST') {
        const urls = [];
        const files = req.files;

        for(const file of files) {
            const { path } = file;

            const newPath = await uploader(path);

            urls.push(newPath);

            fs.unlinkSync(path);
        
            }
            
            databaseAcc.accesorio.push({
                tipo: req.body.tipo,
                modelo: req.body.modelo,
                precio: req.body.precio,
                link: req.body.link,
                url: urls[0].url,
                id: urls[0].id
            });

    
        res.status(200).json('exito');
           /* message: 'imagen subida exitosamente',
            database: databaseAcc.accesorio
           // data: urls
        })*/
    } else {
        res.status(405).json({
            err: "No se pudo subir la imagen"
        })
    }
})


app.listen(3000, () => {
    console.log('Im alive on port 3000');
})



/*

/ --> res = this is working
/signin --> POST = success/fail


*/