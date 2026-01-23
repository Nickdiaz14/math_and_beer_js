const express = require('express')

const router = express.Router()

const gameController = require('../controllers/gameController')

router.post('/create_user', gameController.createUser)
router.put('/record', gameController.createOrUpdateRecord)
router.get('/leaderboard/:game', gameController.getLeaderboard)
router.get('/leaderboards', gameController.getLeaderboards)

module.exports = router