require('dotenv').config();
const conectarDB = require('./config/db');
const app = require('./app');
const port = 5000;

async function start() {
    await conectarDB();
    app.listen(port, () => {
        console.log(`Servido escuchando en el puerto ${port}`)
    })
}

start();