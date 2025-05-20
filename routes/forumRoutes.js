const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Forum
 *   description: Forum management endpoints
 */

// All routes are protected
router.use(authMiddleware);

/**
 * @swagger
 * /api/forum:
 *   get:
 *     summary: Get all forum posts
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of forum posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ForumPost'
 */
router.get('/', forumController.getAllPosts);

/**
 * @swagger
 * /api/forum/{id}:
 *   get:
 *     summary: Get forum post by ID
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Forum post details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForumPost'
 *       404:
 *         description: Post not found
 */
router.get('/:id', forumController.getPostById);

/**
 * @swagger
 * /api/forum:
 *   post:
 *     summary: Create new forum post
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForumPost'
 *     responses:
 *       201:
 *         description: Forum post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForumPost'
 */
router.post('/', forumController.createPost);

/**
 * @swagger
 * /api/forum/{id}:
 *   put:
 *     summary: Update forum post
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForumPost'
 *     responses:
 *       200:
 *         description: Forum post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForumPost'
 *       404:
 *         description: Post not found
 */
router.put('/:id', forumController.updatePost);

/**
 * @swagger
 * /api/forum/{id}:
 *   delete:
 *     summary: Delete forum post
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Forum post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete('/:id', forumController.deletePost);

/**
 * @swagger
 * /api/forum/{id}/notifications:
 *   post:
 *     summary: Create forum notification
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_partilha:
 *                 type: integer
 *                 description: Post ID
 *               titulo:
 *                 type: string
 *                 description: Notification title
 *               conteudo:
 *                 type: string
 *                 description: Notification content
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 titulo:
 *                   type: string
 *                 conteudo:
 *                   type: string
 *                 data_criacao:
 *                   type: string
 *                   format: date-time
 */
router.post('/:id/notifications', forumController.createNotification);

module.exports = router;
