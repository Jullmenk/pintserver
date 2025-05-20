const { Quizzes, Perguntas, Respostas, SubmissoesQuizzes } = require('../models');

// Get all quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quizzes.findAll({
      include: [
        {
          model: Perguntas,
          include: [{
            model: Respostas,
          }]
        },
        {
          model: SubmissoesQuizzes,
        }
      ]
    });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching quizzes' });
  }
};

// Get quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quizzes.findByPk(req.params.id, {
      include: [
        {
          model: Perguntas,
          include: [{
            model: Respostas,
          }]
        },
        {
          model: SubmissoesQuizzes,
        }
      ]
    });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching quiz' });
  }
};

// Create quiz
const createQuiz = async (req, res) => {
  try {
    const { id_ocorrencia, titulo, descricao, tempo_limite, capa, estado } = req.body;
    const quiz = await Quizzes.create({
      id_ocorrencia,
      titulo,
      descricao,
      tempo_limite,
      capa,
      estado
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Error creating quiz' });
  }
};

// Submit quiz answer
const submitQuiz = async (req, res) => {
  try {
    const { id_quiz, id_utilizador, pontuacao } = req.body;
    const submission = await SubmissoesQuizzes.create({
      id_quizz: id_quiz,
      id_utilizador,
      pontuacao,
      data_inicio: new Date(),
      data_submissao: new Date()
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Error submitting quiz' });
  }
};

// Get quiz results
const getQuizResults = async (req, res) => {
  try {
    const results = await SubmissoesQuizzes.findAll({
      where: { id_quizz: req.params.id },
      include: [{
        model: Utilizadores,
      }]
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching quiz results' });
  }
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  submitQuiz,
  getQuizResults
};
