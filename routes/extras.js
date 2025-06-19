const express = require('express');
const router = express.Router();
const extraController = require('../controllers/extraController');


/**
 * @swagger
 * tags:
 *   name: Extra
 *   description: Extra management endpoints
 */

/**
 * @swagger
 * /api/extras/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Extra]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/categories', extraController.getAllCategories);

/**
 * @swagger
 * /api/extras/areas:
 *   get:
 *     summary: Get all areas
 *     tags: [Extra]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Area'
 */
router.get('/areas', extraController.getAllAreas);

/**
 * @swagger
 * /api/extras/topics:
 *   get:
 *     summary: Get all topics
 *     tags: [Extra]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of topics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 */
router.get('/topics', extraController.getAllTopics);

module.exports = router;
