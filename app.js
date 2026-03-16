require('dotenv').config();
const express = require('express');
const router = require('./routes/routes');
const swaggerSpec = require('./swagger');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Bienvenido a mi app con Express')
})

module.exports = app;