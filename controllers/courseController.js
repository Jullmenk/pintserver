const { Cursos, Topicos, Avaliacoes, OcorrenciasCurso, Utilizadores, InscricoesOcorrencia } = require('../models');
const cloudinary = require('../config/cloudinary');


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
    const { id_topico, titulo, descricao } = req.body;

    const capaFile = req.files['url_capa']?.[0];
    const iconFile = req.files['url_icon']?.[0];

    if (!capaFile || !iconFile) {
      return res.status(400).json({ error: "Imagens obrigatórias em falta." });
    }

    const uploadCapa = await cloudinary.uploader.upload(capaFile.path, {
      upload_preset: "pint",
    });

    const uploadIcon = await cloudinary.uploader.upload(iconFile.path, {
      upload_preset: "pint",
    });


    const course = await Cursos.create({
      id_topico,
      titulo,
      descricao,
      url_capa: {
        secure_url: uploadCapa.secure_url,
        url: uploadCapa.url
      },
      url_icon: {
        secure_url: uploadIcon.secure_url,
        url: uploadIcon.url
      }
    });

    console.log(course);
    res.status(201).json(course);
  } catch (error) {
    console.log(error);
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

    const { id_topico, titulo, descricao} = req.body;
    let {url_capa, url_icon } = req.body
    const capaFile = req.files['url_capa']?.[0];
    const iconFile = req.files['url_icon']?.[0];

    if(capaFile){
      const uploadResponse = await cloudinary.uploader.upload(capaFile.path, {
        upload_preset: "pint",
      });
      if(uploadResponse){
        await cloudinary.uploader.destroy(course.url_capa.secure_url);
      }
      url_capa = {
        secure_url: uploadResponse.secure_url,
        url: uploadResponse.url,
      }
    }

    if(iconFile){
      const uploadResponse = await cloudinary.uploader.upload(iconFile.path, {
        upload_preset: "pint",
      });
      if(uploadResponse){
        await cloudinary.uploader.destroy(course.url_icon.secure_url);
      }
      url_icon = {
        secure_url: uploadResponse.secure_url,
        url: uploadResponse.url,
      }
    }

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

    if(course.url_capa.secure_url){
      await cloudinary.uploader.destroy(course.url_capa.secure_url);
    }

    if(course.url_icon.secure_url){
      await cloudinary.uploader.destroy(course.url_icon.secure_url);
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
    if(users.length === 0){
      return res.status(404).json({ error: 'Esse curso não tem nenhum utilizador inscrito.' });
    }
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
