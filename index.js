const express = require('express');
const bodyParser = require('body-parser');
const upload = require('./multer');
const cloudinary = require('./cloudinary');
const fs = require('fs');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const register = require('./controllers/Register');
const signin = require('./controllers/SignIn');
const delet = require('./controllers/Delete');
const home = require('./controllers/Home');

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL?ssl: true,
    }
  });




const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => { res.send('It works!') });

//Home

app.get('/home', (req, res) => { home.handleHome(req, res, db) });


//Signin

app.post('/signin',  signin.handleSignIn(db, bcrypt));

// Register

app.post('/register', (req, res) =>  { register.handleRegister(req, res, db, bcrypt) });

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
        
            };

            db('content').insert({
                name: req.body.tipo,
                modelo: req.body.modelo,
                precio: req.body.precio,
                link: req.body.link,
                url: urls[0].url,
               // id: urls[0].id

            })
               .then(console.log)
    
        res.status(200).json('exito');
    } else {
        res.status(405).json({
            err: "No se pudo subir la imagen"
        })
    }
    
})

//Delete

app.delete('/delete', (req, res) => { delet.handleDelete(req, res, db) });


app.listen(process.env.PORT ||  3000, () => {
    console.log(`Alive here ${process.env.PORT}`);
})
