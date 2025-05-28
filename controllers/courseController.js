const { Cursos, Topicos, Avaliacoes, OcorrenciasCurso, Utilizadores, InscricoesOcorrencia } = require('../models');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Cursos.findAll({
      include: [
        { model: Topicos },
        { model: Avaliacoes },
        { model: OcorrenciasCurso }
      ]
    });
    res.json(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Cursos.findByPk(req.params.id, {
      include: [
        {
          model: Topicos,
        },
        {
          model: Avaliacoes,
        },
        {
          model: OcorrenciasCurso,
        }
      ]
    });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching course' });
  }
};

// Create course
const createCourse = async (req, res) => {
  try {
    const { id_topico, titulo, descricao, url_capa, url_icon } = req.body;
    const course = await Cursos.create({
      id_topico,
      titulo,
      descricao,
      url_capa,
      url_icon
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error creating course' });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const course = await Cursos.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { id_topico, titulo, descricao, url_capa, url_icon } = req.body;
    
    await course.update({
      id_topico,
      titulo,
      descricao,
      url_capa,
      url_icon
    });

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error updating course' });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Cursos.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting course' });
  }
};

// Get user courses
const getUsersCourses = async (req, res) => {
  try {
    const utilizadores = await Utilizadores.findAll({
      include: [{
        model: InscricoesOcorrencia,
        include: [{
          model: OcorrenciasCurso,
          where: { id_curso: req.params.id }, // filtra pelo curso
          attributes: [] // não precisa retornar os dados da ocorrência
        }]
      }]
    });

    const users =  utilizadores.map(utilizador => {
      return {
        id_utilizador: utilizador.id_utilizador,
        nome: utilizador.nome,
        email: utilizador.email,
        url_foto_perfil: utilizador.url_foto_perfil,
        biografia: utilizador.biografia,
        departamento: utilizador.departamento,
      };
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar utilizadores do curso' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getUsersCourses
};
