const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer')
const upload = multer({dest:'uploads/'})

/**
 * @swagger
 * tags:
 *   name: Forum
 *   description: Forum management endpoints
 */

// All routes are protected
//router.use(authMiddleware);

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
 *               type: object
 *               properties:
 *                 id_topico:
 *                   type: integer
 *                   description: Topic ID
 *                 id_utilizador:
 *                   type: integer
 *                   description: User ID
 *                 sub_partilha:
 *                   type: integer
 *                   description: Sub-partilha ID
 *                 titulo:
 *                   type: string
 *                   description: Post title
 *                 conteudo:
 *                   type: string
 *                   description: Post content
 *                 url_pdf:
 *                   type: file
 *                   description: PDF URL
 *                 url_imagem:
 *                   type: file
 *                   description: Image URL
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
 *             type: object
 *             properties:
 *               id_topico:
 *                 type: integer
 *                 description: Topic ID
 *               id_utilizador:
 *                 type: integer
 *                 description: User ID
 *               sub_partilha:
 *                 type: integer
 *                 description: Sub-partilha ID
 *               titulo:
 *                 type: string
 *                 description: Post title
 *               conteudo:
 *                 type: string
 *                 description: Post content
 *               url_pdf:
 *                 type: file
 *                 description: PDF URL
 *               url_imagem:
 *                 type: file
 *                 description: Image URL
 *     responses:
 *       201:
 *         description: Forum post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_topico:
 *                   type: integer
 *                   description: Topic ID
 *                 id_utilizador:
 *                   type: integer
 *                   description: User ID
 *                 sub_partilha:
 *                   type: integer
 *                   description: Sub-partilha ID
 *                 titulo:
 *                   type: string
 *                   description: Post title
 *                 conteudo:
 *                   type: string
 *                   description: Post content
 *                 url_pdf:
 *                   type: file
 *                   description: PDF URL
 *                 url_imagem:
 *                   type: file
 *                   description: Image URL
 */
router.post('/', upload.fields([
    { name: 'url_pdf', maxCount: 1 },
    { name: 'url_imagem', maxCount: 1 }
  ]), forumController.createPost);

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
 *             type: object
 *             properties:
 *               id_topico:
 *                 type: integer
 *                 description: Topic ID
 *               id_utilizador:
 *                 type: integer
 *                 description: User ID
 *               sub_partilha:
 *                 type: integer
 *                 description: Sub-partilha ID
 *               titulo:
 *                 type: string
 *                 description: Post title
 *               conteudo:
 *                 type: string
 *                 description: Post content
 *               url_pdf:
 *                 type: file
 *                 description: PDF URL
 *               url_imagem:
 *                 type: file
 *                 description: Image URL
 *     responses:
 *       200:
 *         description: Forum post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_topico:
 *                   type: integer
 *                   description: Topic ID
 *                 id_utilizador:
 *                   type: integer
 *                   description: User ID
 *                 sub_partilha:
 *                   type: integer
 *                   description: Sub-partilha ID
 *                 titulo:
 *                   type: string
 *                   description: Post title
 *                 conteudo:
 *                   type: string
 *                   description: Post content
 *                 url_pdf:
 *                   type: file
 *                   description: PDF URL
 *                 url_imagem:
 *                   type: file
 *                   description: Image URL
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
 * /api/forum/{id}/delete/{id_conteudoPartilha}:
 *   delete:
 *     summary: Delete forum post content pdf/img
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
 *       - in: path
 *         name: id_conteudoPartilha
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Forum post deleted successfully
 *       404:
 *         description: Post content not found
 */
router.delete('/:id/delete/:id_conteudoPartilha', forumController.deleteContent);

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

/** 
 * @swagger
 * 
 * /api/forum/denounce:
 *   post:
 *     summary: Denounce forum post
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
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
 *               id_utilizador:
 *                 type: integer
 *                 description: User ID
 *               descricao:
 *                 type: string
 *                 description: Denouncement description
 *     responses:
 *       201:
 *         description: Denouncement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 id_partilha:
 *                   type: integer
 *                 id_utilizador:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 data_criacao:
 *                   type: string
 *                   format: date-time
 */
router.post('/denounce', forumController.denouncePost);

module.exports = router;
