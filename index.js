const express = require('express');
const bodyParser = require('body-parser');
const upload = require('./multer');
const cloudinary = require('./cloudinary');
const fs = require('fs');
const cors = require('cors');


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
const databaseAcc = {
    accesorio:[{
        tipo: 'case',
        modelo: 'iphone X',
        precio: '$15',
        url: '',
        id: ''
    }]
}

app.get('/', (req,res) => {
    res.send(databaseUser.usuario);
})


app.post('/signin', (req,res) => {
    if(req.body.user === databaseUser.usuario[0].user &&
        req.body.password === databaseUser.usuario[0].password){
            res.json('acceso garantizado');
        } else {
            res.status(400).json('quien es este impostor?');
        }
})


app.post('/register', (req, res) => {
    const { user, password } = req.body;
    databaseUser.usuario.push({
        user: user,
        password: password
    });
    res.json(databaseUser.usuario[databaseUser.usuario.length -1]);
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
                url: urls[0].url,
                id: urls[0].id
            });

    
        res.status(200).json({
            message: 'imagen subida exitosamente',
            database: databaseAcc
           // data: urls
        })
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