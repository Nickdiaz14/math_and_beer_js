const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
    try {
        let eventos = await Event.find()
        res.send(eventos)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

exports.createEvent = async (req, res) => {
    try {
        let nuevoEvento = new Event(req.body);
        await nuevoEvento.save()
        res.send(nuevoEvento)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}