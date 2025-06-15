const express = require('express');
const router = express.Router();
const { createOcorrencia, updateOcorrencia, deleteOcorrencia, submeterTrabalho, avaliarTrabalho } = require('../controllers/ocorrenciasController');
const multer = require('multer')
const upload = multer({dest:'uploads/'})

/**
 * @swagger
 * /api/ocorrencias:
 *   post:
 *     summary: Cria uma nova ocorrência de curso
 *     description: Cria uma nova ocorrência de curso com as informações fornecidas
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
  *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data_inicio:
 *                 type: string
 *                 format: date
 *                 description: Nova data de início
 *               data_fim:
 *                 type: string
 *                 format: date
 *                 description: Nova data de término
 *               vagas_disponiveis:
 *                 type: integer
 *                 description: Obrigatorio se for sincrono. Novo número de vagas disponíveis
 *               data_limite_inscricao:
 *                 type: string
 *                 format: date
 *                 description: Nova data limite para inscrições
 *               estado:
 *                 type: integer
 *                 description: Novo estado da ocorrência (1 - ativo | 0 - inativo)
 *               id_utilizador:
 *                 type: integer
 *                 description: ID do utilizador que está atualizando a ocorrência
 *               tipo_ocorrencia:
 *                 type: string
 *                 required: true
 *                 description: Novo tipo de ocorrência (Síncrono | Assíncrono)
 *               total_horas:
 *                 type: integer
 *                 description: Novo número de horas totais
 *               horario:
 *                 type: string
 *                 description: Obrigatorio se for sincrono. Novo horário
 *     responses:
 *       200:
 *         description: Ocorrência criada com sucesso
 *       400:
 *         description: Erro na validação dos dados
 *       404:
 *         description: Curso ou utilizador não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', createOcorrencia);

/**
 * @swagger
 * /api/ocorrencias/{id}:
 *   delete:
 *     summary: Elimina uma ocorrência existente
 *     description: Elimina uma ocorrência específica pelo seu ID
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da ocorrência a ser eliminada
 *     responses:
 *       200:
 *         description: Ocorrência eliminada com sucesso
 *       404:
 *         description: Ocorrência não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', deleteOcorrencia);

/**
 * @swagger
 * /api/ocorrencias/{id}:
 *   put:
 *     summary: Atualiza uma ocorrência existente
 *     description: Atualiza os dados de uma ocorrência específica
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da ocorrência a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data_inicio:
 *                 type: string
 *                 format: date
 *                 description: Nova data de início
 *               data_fim:
 *                 type: string
 *                 format: date
 *                 description: Nova data de término
 *               vagas_disponiveis:
 *                 type: integer
 *                 description: Obrigatorio se for sincrono. Novo número de vagas disponíveis
 *               data_limite_inscricao:
 *                 type: string
 *                 format: date
 *                 description: Nova data limite para inscrições
 *               estado:
 *                 type: integer
 *                 description: Novo estado da ocorrência (1 - ativo | 0 - inativo)
 *               id_utilizador:
 *                 type: integer
 *                 description: ID do utilizador que está atualizando a ocorrência
 *               tipo_ocorrencia:
 *                 type: string
 *                 required: true
 *                 description: Novo tipo de ocorrência (Síncrono | Assíncrono)
 *               total_horas:
 *                 type: integer
 *                 description: Novo número de horas totais
 *               horario:
 *                 type: string
 *                 description: Obrigatorio se for sincrono. Novo horário
 *     responses:
 *       200:
 *         description: Ocorrência atualizada com sucesso
 *       400:
 *         description: Erro na validação dos dados
 *       404:
 *         description: Ocorrência ou curso não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', updateOcorrencia);

/**
 * @swagger
 * /api/ocorrencias/{id_ocorrencia}/submeter-trabalho/{id_trabalho}:
 *   post:
 *     summary: Submeter um trabalho para uma ocorrência
 *     description: Submeter um trabalho para uma ocorrência específica
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_ocorrencia
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da ocorrência para a qual o trabalho está sendo submetido
 *       - in: path
 *         name: id_trabalho
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do trabalho a ser submetido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_utilizador:
 *                 type: integer
 *                 description: ID do utilizador que está a submeter o trabalho
 *     responses:
 *       200:
 *         description: Trabalho submetido com sucesso
 *       404:
 *         description: Ocorrência ou trabalho não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/:id_ocorrencia/submeter-trabalho/:id_trabalho', 
    upload.fields([{ name: 'url_pdf', maxCount: 1 }]), submeterTrabalho);


/** 
 * @swagger 
 * 
 * /api/ocorrencias/avaliar-trabalho/{id_submissao_trabalho}:
 *   put:
 *     summary: Avaliar um trabalho submetido para uma ocorrência
 *     description: Avaliar um trabalho submetido para uma ocorrência específica
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_submissao_trabalho
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da submissão de trabalho a ser avaliada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_docente:
 *                 type: integer
 *                 description: ID do docente que está avaliando o trabalho
 *               nota:
 *                 type: integer
 *                 description: Nota atribuída ao trabalho
 *               feedback:
 *                 type: string
 *                 description: Feedback fornecido ao aluno
 *     responses:
 *       200:
 *         description: Trabalho avaliado com sucesso e envio de email ao utilizador
 *       404:
 *         description: Submissão de trabalho ou ocorrência não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/avaliar-trabalho/:id_submissao_trabalho', avaliarTrabalho);

module.exports = router;