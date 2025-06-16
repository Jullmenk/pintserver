const { Cursos, Topicos, Avaliacoes, OcorrenciasCurso, Utilizadores, InscricoesOcorrencia, Areas, Categorias, TrabalhosOcorrencia, SubmissoesTrabalhos, Contudos } = require('../models');
const cloudinary = require('../config/cloudinary');
const { notifyUser } = require('../email/email');
const { destruirArquivoAnterior } = require('../lib/utils');
const path = require('path');

/* cursos estados : 1 - ativo | 0 - inativo
ocorrencias estados : 1 - ativo | 0 - inativo
inscricoes estados : 1 - concluida | 0 - em andamento
*/

const getAllCourses = async (req, res) => {
  try {
    const courses = await Cursos.findAll({
      include: [
        {
          model: Topicos,
          include: [
            {
              model: Areas,
              include: [
                {
                  model: Categorias
                }
              ]
            }
          ]
        },
        { model: Avaliacoes },
        { model: OcorrenciasCurso,
          include: [
            {model: Contudos},
            {model: TrabalhosOcorrencia,
              include: [
                {
                  model: SubmissoesTrabalhos,
                  include: [
                    {
                      model: Utilizadores
                    }
                  ]
                }
              ]
            }
          ]
        },
      ]
    });
    res.json(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
};


const getCoursesByCategory = async (req, res) => {
  try {
    const courses = await Cursos.findAll({
      include: [
        {
          model: Topicos,
          include: [
            {
              model: Areas,
              include: [
                {
                  model: Categorias,
                  where: {
                    id_categoria: req.params.id
                  }
                }
              ]
            }
          ]
        },
        { model: Avaliacoes },
        { model: OcorrenciasCurso,
          include: [
            {model: Contudos},
            {model: TrabalhosOcorrencia,
              include: [
                {
                  model: SubmissoesTrabalhos,
                  include: [
                    {
                      model: Utilizadores
                    }
                  ]
                }
              ]
            }
          ]
        },
      ],
    });
    res.json(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
}

const getCoursesByArea = async (req, res) => {
  try {
    const courses = await Cursos.findAll({
      include: [
        {
          model: Topicos,
          include: [
            {
              model: Areas,
              where: {
                id_area: req.params.id
              },
              include: [
                {
                  model: Categorias
                }
              ]
            }
          ]
        },
        { model: Avaliacoes },
        { model: OcorrenciasCurso,
          include: [
            {model: Contudos},
            {model: TrabalhosOcorrencia,
              include: [
                {
                  model: SubmissoesTrabalhos,
                  include: [
                    {
                      model: Utilizadores
                    }
                  ]
                }
              ]
            }
          ]
        },
      ],
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
        { model: OcorrenciasCurso,
          include: [
            {model: Contudos},
            {model: TrabalhosOcorrencia,
              include: [
                {
                  model: SubmissoesTrabalhos,
                  include: [
                    {
                      model: Utilizadores
                    }
                  ]
                }
              ]
            }
          ]
        },
      ]
    });

    const courseData = {
      id_curso: course.id_curso,
      id_topico: course.id_topico,
      topico: course.Topico.titulo,
      titulo: course.titulo,
      estado: course.estado,
      descricao: course.descricao,
      url_capa: JSON.parse(course.url_capa).url,
      url_icon: JSON.parse(course.url_icon).url,
      data_criacao: course.data_criacao,
      ultima_atualizacao: course.ultima_atualizacao,
      Avaliacoes: course.dataValues.Avaliacoes,
      OcorrenciasCurso: course.dataValues.OcorrenciasCursos,
      Contudos: course.dataValues.Contudos,
    };
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(courseData);
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
      },
      estado: 1
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

    const { id_topico, titulo, descricao, estado } = req.body;

    if(estado !== 1 && estado !== 0){
      return res.status(400).json({ error: 'Estado invalido' });
    }
    let {url_capa, url_icon } = req.body
    const capaFile = req.files['url_capa']?.[0];
    const iconFile = req.files['url_icon']?.[0];

    if(capaFile){
      const uploadResponse = await cloudinary.uploader.upload(capaFile.path, {
        upload_preset: "pint",
      });
      if(uploadResponse){
      const url = course.url_capa.secure_url;

      await destruirArquivoAnterior(url);
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
      await destruirArquivoAnterior(course.url_icon.secure_url);
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
      estado,
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
      await destruirArquivoAnterior(course.url_capa.secure_url);
    }

    if(course.url_icon.secure_url){
      await destruirArquivoAnterior(course.url_icon.secure_url);
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
          where: { id_curso: req.params.id },
          attributes: [] 
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

// Add user course

const addUserCourse = async (req, res) => {
  try {

    const { id_utilizador, id_ocorrencia, tipo_utilizador } = req.body;

    const user = await Utilizadores.findByPk(id_utilizador);
    if (!user) {
      return res.status(404).json({ error: 'Utilizador nao encontrado' });
    }

    if(tipo_utilizador !== 3){
      return res.status(403).json({ error: 'Apenas formandos podem inscrever-se a um curso' });
    }

    if(user.primeiro_login == null){
      return res.status(401).json({ error: 'Utilizador nao verificado' });
    }

    const ocorrencia = await OcorrenciasCurso.findByPk(id_ocorrencia);
    if (!ocorrencia) {
      return res.status(404).json({ error: 'Ocorrência não encontrada' });
    }

    if(ocorrencia.estado === 0){
      return res.status(400).json({ error: 'Esse curso não está disponivel para inscricao' });
    }

    if(new Date(ocorrencia.data_limite_inscricao) < new Date()){
      return res.status(400).json({ error: 'Ja passou a data limite de inscricao' });
    }

    if(ocorrencia.vagas_disponiveis !== null){
      if(ocorrencia.vagas_disponiveis > 0){
        ocorrencia.vagas_disponiveis -= 1;
        await ocorrencia.save();
      }else{
        return res.status(400).json({ error: 'Nao ha vagas disponiveis' });
      }
    }

    const jaInscrito = await InscricoesOcorrencia.findOne({
      where: { id_utilizador, id_ocorrencia }
    });
    if (jaInscrito) {
      return res.status(400).json({ error: 'Já está inscrito nesta ocorrência' });
    }

    const novaInscricao = await InscricoesOcorrencia.create({
      id_utilizador,
      id_ocorrencia,
      data_inscricao: new Date().toISOString().slice(0, 19).replace("T", " "),
      estado: 0 
    })

    const curso = await Cursos.findByPk(ocorrencia.id_curso);

    if(novaInscricao){
      notifyUser(user.email, `Olá ${user.nome}, foi adicionado a uma ocorrência`, `Recebemos o seu pedido de inscricao para uma ocorrencia do curso ${curso.titulo}, e foi realizado com sucesso.`,`Breve resumo do curso: ${curso.descricao}`)
      return res.status(201).json({ message: 'Utilizador adicionado à ocorrência com sucesso' });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao adicionar utilizador a ocorrência' });
  }
};

const removeUserFromCourse = async (req, res) => {

  try {

    const { id_ocorrencia, id_utilizador } = req.body;

    const inscricao = await InscricoesOcorrencia.findOne({
      where: { id_utilizador, id_ocorrencia }
    });

    if (!inscricao) {
      return res.status(404).json({ error: 'Inscrição não encontrada' });
    }

    const ocorrencia = await OcorrenciasCurso.findByPk(id_ocorrencia);
    if (!ocorrencia) {
      return res.status(404).json({ error: 'Ocorrência não encontrada' });
    }

    if(ocorrencia.vagas_disponiveis !== null){
      ocorrencia.vagas_disponiveis += 1;
      await ocorrencia.save();
    }

    const user = await Utilizadores.findByPk(id_utilizador);
    const curso = await Cursos.findByPk(ocorrencia.id_curso);

    notifyUser(user.email, `Olá ${user.nome}, foi removido de uma ocorrência`, `Estamos a enviar esse email para confirmar que foi removido de uma ocorrencia do curso ${curso.titulo}.`,``)

    await inscricao.destroy();

    return res.status(200).json({ message: 'Utilizador removido da ocorrência com sucesso' })

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao remover utilizador da ocorrência' });
  }
};

const teste = async (req, res) => {
  try {
    const course = await Contudos.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Contudo not found' });
    }

      const pdfFile = req.files['url_pdf']?.[0];
      let url_pdf = null;
      let conteudo_pdf = null;

      if (pdfFile) {
        const fileExtension = pdfFile.originalname.slice(-4).toLowerCase();
        if (fileExtension !== ".pdf") {
          return res.status(400).json({ error: "Arquivo inválido, deve ser .pdf" });
        }
    
        const uploadResponse = await cloudinary.uploader.upload(pdfFile.path, {
          resource_type: "raw",
          public_id: `docs/${path.parse(pdfFile.originalname).name}.pdf`,
          upload_preset: "pint",
        });
    
        url_pdf = uploadResponse.url;
    
        if (url_pdf) {
          conteudo_pdf = await course.update({
            conteudo: url_pdf,
          });
        }
    
      } 

    res.json(course);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching course' });
  }
};


module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getUsersCourses,
  getCoursesByCategory,
  getCoursesByArea,
  addUserCourse,
  removeUserFromCourse,
  teste,
};
