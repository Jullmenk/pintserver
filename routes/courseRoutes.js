const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer')
const upload = multer({dest:'uploads/'})

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management endpoints
 */

// All routes are protected
router.use(authMiddleware);

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.get('/:id', courseController.getCourseById);


/**
 * @swagger
 * /api/courses/category/{id}:
 *   get:
 *     summary: Get courses by category ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: List of courses by category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/category/:id', courseController.getCoursesByCategory);

/**
 * @swagger
 * /api/courses/area/{id}:
 *   get:
 *     summary: Get courses by area ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Area ID
 *     responses:
 *       200:
 *         description: List of courses by area
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/area/:id', courseController.getCoursesByArea);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 */
router.post('/',upload.fields([
    { name: 'url_capa', maxCount: 1 },
    { name: 'url_icon', maxCount: 1 }
  ]),courseController.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.put('/:id', upload.fields([
    { name: 'url_capa', maxCount: 1 },
    { name: 'url_icon', maxCount: 1 }
  ]),courseController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete('/:id', courseController.deleteCourse);

/**
 * @swagger
 * /api/courses/{id}/users:
 *   get:
 *     summary: Get users enrolled in course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: List of users enrolled in course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/:id/users', courseController.getUsersCourses);

/**
 * @swagger
 * /api/courses/{id}/users:
 *   post:
 *     summary: Inscreve um utilizador numa ocorrência de curso
 *     description: Inscreve um utilizador na ocorrência de curso especificada. A inscrição só ocorre se o utilizador e a ocorrência existirem e se ele ainda não estiver inscrito.
 *     tags:
 *       - [Courses]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do curso
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_utilizador
 *               - id_ocorrencia
 *             properties:
 *               id_utilizador:
 *                 type: integer
 *                 example: 1
 *               id_ocorrencia:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Inscrição realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Curso adicionado com sucesso
 *       400:
 *         description: Utilizador já está inscrito nesta ocorrência
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Já está inscrito nesta ocorrência
 *       401:
 *         description: Utilizador não verificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Utilizador não verificado
 *       403:
 *         description: Apenas formandos podem inscrever-se a um curso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Apenas formandos podem inscrever-se a um curso
 * 
 *       404:
 *         description: Utilizador ou ocorrência não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ocorrência não encontrada
 *       500:
 *         description: Erro ao tentar inscrever
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao adicionar curso
 */

router.post('/:id/users', courseController.addUserCourse);


/**
 * @swagger
 * /api/courses/{id}/users:
 *   delete:
 *     summary: Remove um utilizador de uma ocorrência de curso
 *     description: Cancela a inscrição de um utilizador numa ocorrência específica de curso.
 *     tags:
 *       - [Courses]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do curso
 *         schema:
 *           type: integer
 *           example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_utilizador
 *               - id_ocorrencia
 *             properties:
 *               id_utilizador:
 *                 type: integer
 *                 example: 1
 *               id_ocorrencia:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Utilizador removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilizador removido da ocorrência com sucesso
 *       404:
 *         description: Inscrição não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Inscrição não encontrada
 *       500:
 *         description: Erro ao remover inscrição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao remover utilizador da ocorrência
 */

router.delete('/:id/users', courseController.removeUserFromCourse);
module.exports = router;
