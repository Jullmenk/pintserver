const express = require('express');
const router = express.Router();
const { createOcorrencia, updateOcorrencia, deleteOcorrencia, submeterTrabalho, avaliarTrabalho, atualizarTrabalhoSubmetido, apagarTrabalhoSubmetido, adicionarConteudoOcorrencia, atualizarConteudoOcorrencia, deleteConteudoOcorrencia } = require('../controllers/ocorrenciasController');
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

/**
 * @swagger
 * 
 * /api/ocorrencias/atualizar-trabalho-submetido/{id_submissao_trabalho}:
 *   put:
 *     summary: Atualizar um trabalho submetido de uma ocorrência
 *     description: Atualizar um trabalho submetido de uma ocorrência específica
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_submissao_trabalho
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da submissão de trabalho a ser atualizada
 *     responses:
 *       200:
 *         description: Trabalho atualizado com sucesso
 *       404:
 *         description: Submissão de trabalho ou ocorrência não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/atualizar-trabalho-submetido/:id_submissao_trabalho', upload.fields([{ name: 'url_pdf', maxCount: 1 }]), atualizarTrabalhoSubmetido);

/**
 * @swagger
 * 
 * /api/ocorrencias/apagar-trabalho-submetido/{id_submissao_trabalho}:
 *   delete:
 *     summary: Apagar um trabalho submetido de uma ocorrência
 *     description: Apagar um trabalho submetido de uma ocorrência específica
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_submissao_trabalho
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da submissão de trabalho a ser apagada
 *     responses:
 *       200:
 *         description: Trabalho apagado com sucesso
 *       404:
 *         description: Submissão de trabalho ou ocorrência não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/apagar-trabalho-submetido/:id_submissao_trabalho', apagarTrabalhoSubmetido);

/**
 * @swagger
 * 
 * /api/ocorrencias/apagar-conteudo-ocorrencia/{id_conteudo}:
 *   delete:
 *     summary: Apagar um conteúdo de uma ocorrência
 *     description: Apagar um conteúdo de uma ocorrência específica
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_conteudo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do conteúdo a ser apagado
 *     responses:
 *       200:
 *         description: Conteúdo apagado com sucesso
 *       404:
 *         description: Conteúdo ou ocorrência não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/apagar-conteudo-ocorrencia/:id_conteudo', deleteConteudoOcorrencia);

/**
 * @swagger
 * 
 * /api/ocorrencias/adicionar-conteudo-ocorrencia/{id_ocorrencia}:
 *   post:
 *     summary: Adicionar um conteúdo a uma ocorrência
 *     description: Adicionar um conteúdo a uma ocorrência específica
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_ocorrencia
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da ocorrência a que o conteúdo será adicionado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título do conteúdo
 *               conteudo:
 *                 type: string
 *                 description: Conteúdo (PDF | Vídeo) se for Video apenas colococar o link do video, caso pdf submeter o pdf no url_pdf 
 *               id_utilizador:
 *                 type: integer
 *                 description: ID do utilizador que está a adicionar o conteúdo
 *               url_pdf:
 *                 type: file
 *                 description: PDF do conteúdo
 *     responses:
 *       200:
 *         description: Conteúdo adicionado com sucesso
 *       404:
 *         description: Ocorrência não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/adicionar-conteudo-ocorrencia/:id_ocorrencia', upload.fields([{ name: 'url_pdf', maxCount: 1 }]), adicionarConteudoOcorrencia);

/**
 * @swagger
 * 
 * /api/ocorrencias/atualizar-conteudo-ocorrencia/{id_conteudo}:
 *   put:
 *     summary: Atualizar um conteúdo de uma ocorrência
 *     description: Atualizar um conteúdo de uma ocorrência específica
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_conteudo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do conteúdo a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título do conteúdo
 *               conteudo:
 *                 type: string
 *                 description: Conteúdo (PDF | Vídeo) se for Video apenas colococar o link do video, caso pdf submeter o pdf no url_pdf, caso nao alterar apenas o titulo ou estado ignorar esse campo e o campo do url_pdf
 *               id_utilizador:
 *                 type: integer
 *                 description: ID do utilizador que está a atualizar o conteúdo
 *               url_pdf:
 *                 type: file
 *                 description: PDF do conteúdo
 *     responses:
 *       200:
 *         description: Conteúdo atualizado com sucesso
 *       404:
 *         description: Conteúdo ou ocorrência não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/atualizar-conteudo-ocorrencia/:id_conteudo', upload.fields([{ name: 'url_pdf', maxCount: 1 }]), atualizarConteudoOcorrencia);

module.exports = router;