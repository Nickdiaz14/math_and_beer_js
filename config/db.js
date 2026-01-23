const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        const dbUri = process.env.DB_MONGO
        if (!dbUri) {
            throw new Error("La variable DB_MONGO no existe.");

        }
        await mongoose.connect(dbUri, {})
        console.log('Conexión existosa a la base de datos')
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error)
        process.exit(1);
    }
}

module.exports = conectarDB;