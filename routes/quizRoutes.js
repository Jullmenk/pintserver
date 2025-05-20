const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management endpoints
 */

// All routes are protected
router.use(authMiddleware);

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 */
router.get('/', quizController.getAllQuizzes);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Get quiz by ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 */
router.get('/:id', quizController.getQuizById);

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create new quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 */
router.post('/', quizController.createQuiz);

/**
 * @swagger
 * /api/quizzes/{id}/submit:
 *   post:
 *     summary: Submit quiz answers
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_quiz:
 *                 type: integer
 *                 description: Quiz ID
 *               id_utilizador:
 *                 type: integer
 *                 description: User ID
 *               pontuacao:
 *                 type: integer
 *                 description: Quiz score
 *     responses:
 *       201:
 *         description: Quiz submission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 pontuacao:
 *                   type: integer
 *                 data_inicio:
 *                   type: string
 *                   format: date-time
 *                 data_submissao:
 *                   type: string
 *                   format: date-time
 */
router.post('/:id/submit', quizController.submitQuiz);

/**
 * @swagger
 * /api/quizzes/{id}/results:
 *   get:
 *     summary: Get quiz results
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: List of quiz results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   pontuacao:
 *                     type: integer
 *                   data_inicio:
 *                     type: string
 *                     format: date-time
 *                   data_submissao:
 *                     type: string
 *                     format: date-time
 *                   utilizador:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/:id/results', quizController.getQuizResults);

module.exports = router;
