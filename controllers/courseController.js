const { Cursos, Topicos, Avaliacoes, OcorrenciasCurso } = require('../models');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    console.log('Iniciando busca de cursos...');
    const courses = await Cursos.findAll({
      include: [
        { model: Topicos },
        { model: Avaliacoes },
        { model: OcorrenciasCurso }
      ]
    });
    console.log('Cursos encontrados:', courses.length);
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

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
