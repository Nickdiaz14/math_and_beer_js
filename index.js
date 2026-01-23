require('dotenv').config();
const express = require('express');
const path = require('path');
const conectarDB = require('./config/db');
const router = require('./routes/games')
const app = express();
const port = 5000;

conectarDB();

app.use(express.json())

app.use('/api', router)

app.get('/', (req, res) => {
    res.send('Bienvenido a mi app con Express')
})

app.listen(port, () => {
    console.log(`Servido escuchando en el puerto ${port}`)
})