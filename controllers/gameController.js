const User = require('../models/User');
const Record = require('../models/Record');
const lowScoreGames = ['T04', 'T05', 'T10', 'T4', 'T6', 'T8', 'TSpeed'];

exports.createUser = async (req, res) => {
    try {
        const { username, UUID_id } = req.body;
        const existeCode = await User.findOne({ UUID_id: UUID_id });
        const existeNombre = await User.findOne({ username: username });
        if (existeCode) {
            return res.status(400).send({
                created: false,
                observation: "Ya se asignó este código"
            });
        } else if (existeNombre) {
            return res.status(400).send({
                created: false,
                observation: "Ya existe un usuario con este nombre"
            });
        } else if (username.length > 15) {
            return res.status(400).send({
                created: false,
                observation: "El nombre es muy largo"
            });
        }
        const nuevoUsuario = new User(req.body);
        await nuevoUsuario.save();
        res.status(200).send({ created: true, observation: nuevoUsuario });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).send('Hubo un error en el servidor');
    }
}

exports.getUser = async (req, res) => {
    try {
        let uuid = req.params.uuid
        let usuario = await User.findOne({ UUID_id: uuid })
        res.send(usuario.username)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

exports.getUsers = async (req, res) => {
    try {
        let usuarios = await User.find({})
        res.send(usuarios)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

exports.createOrUpdateRecord = async (req, res) => {
    try {
        const { username, record, string_record, game } = req.body

        let actual_record = await Record.findOne({ username: username, game: game })

        if (!actual_record) {
            let nuevoRecord = new Record({
                username: username,
                game: game,
                record: record,
                string_record: string_record
            })
            await nuevoRecord.save()
            return res.send(nuevoRecord)
        }

        let better = false

        if (lowScoreGames.includes(game)) {
            better = record < actual_record.record
        } else {
            better = record > actual_record.record
        }

        if (better) {
            actual_record = await Record.findByIdAndUpdate(
                actual_record._id,
                { record: record, string_record: string_record },
                { new: true }
            )
        }

        res.send({ better: better, record: actual_record })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

exports.getLeaderboard = async (req, res) => {
    try {
        let leaderboard
        let game = req.params.game
        if (lowScoreGames.includes(game)) {
            leaderboard = await Record.find({ game: game }).sort({ record: 1 }).limit(5)
        } else {
            leaderboard = await Record.find({ game: game }).sort({ record: -1 }).limit(5)
        }
        const result = leaderboard.map((rec, i) => ({ position: i + 1, username: rec.username, record: rec.string_record }));
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

exports.getLeaderboards = async (req, res) => {
    try {
        const uniqueGames = await Record.distinct('game');
        const queries = uniqueGames.map(async (game) => {
            let leaderboard
            if (lowScoreGames.includes(game)) {
                leaderboard = await Record.find({ game: game }).sort({ record: 1 })
            } else {
                leaderboard = await Record.find({ game: game }).sort({ record: -1 })
            }
            return {
                game: game,
                leaderboard: leaderboard.map((rec, i) => ({ position: i + 1, username: rec.username, record: rec.string_record }))
            };
        });
        const result = await Promise.all(queries);
        res.send(result);
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}