const express = require('express')
const router = express.Router()
const gameController = require('../controllers/gameController')
const infoController = require('../controllers/infoController')


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - UUID_id
 *         - username
 *       properties:
 *         UUID_id:
 *           type: string
 *           description: Identificador único del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *
 *     Record:
 *       type: object
 *       required:
 *         - username
 *         - game
 *         - record
 *         - string_record
 *       properties:
 *         username:
 *           type: string
 *         game:
 *           type: string
 *         record:
 *           type: number
 *         string_record:
 *           type: string
 *           description: Representación legible del record
 *
 *     LeaderboardEntry:
 *       type: object
 *       properties:
 *         position:
 *           type: integer
 *         username:
 *           type: string
 *         record:
 *           type: string
 */

/**
 * @swagger
 * /create_user:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error del servidor
 */
router.post('/create_user', gameController.createUser)

/**
 * @swagger
 * /get_user/{uuid}:
 *   get:
 *     summary: Obtiene el username de un usuario por UUID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID del usuario
 *     responses:
 *       200:
 *         description: Username del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       500:
 *         description: Error del servidor
 */
router.get('/get_user/:uuid', gameController.getUser)

/**
 * @swagger
 * /record:
 *   put:
 *     summary: Crea o actualiza el record de un usuario en un juego
 *     tags: [Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Record'
 *     responses:
 *       200:
 *         description: Record creado o resultado de la comparación
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Record'
 *                 - type: object
 *                   properties:
 *                     better:
 *                       type: boolean
 *                       description: Si el nuevo record es mejor que el actual
 *                     record:
 *                       $ref: '#/components/schemas/Record'
 *       500:
 *         description: Error del servidor
 */
router.put('/record', gameController.createOrUpdateRecord)

/**
 * @swagger
 * /leaderboard/{game}:
 *   get:
 *     summary: Obtiene el top 5 del leaderboard de un juego
 *     tags: [Leaderboard]
 *     parameters:
 *       - in: path
 *         name: game
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del juego (ej. T04, T05, T10...)
 *     responses:
 *       200:
 *         description: Top 5 del leaderboard
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeaderboardEntry'
 *       500:
 *         description: Error del servidor
 */
router.get('/leaderboard/:game', gameController.getLeaderboard)

/**
 * @swagger
 * /leaderboards:
 *   get:
 *     summary: Obtiene los leaderboards de todos los juegos
 *     tags: [Leaderboard]
 *     responses:
 *       200:
 *         description: Leaderboards de todos los juegos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   game:
 *                     type: string
 *                   leaderboard:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/LeaderboardEntry'
 *       500:
 *         description: Error del servidor
 */
router.get('/leaderboards', gameController.getLeaderboards)

router.post('/create_event', infoController.createEvent)
router.get('/events', infoController.getEvents)

module.exports = router