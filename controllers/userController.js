const { Utilizadores, TipoUtilizador, Cursos, InscricoesOcorrencia, OcorrenciasCurso, Topicos } = require('../models');
const cloudinary = require('../config/cloudinary');
const { destruirArquivoAnterior } = require('../lib/utils');
// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Utilizadores.findAll({
      include: [{
        model: TipoUtilizador,
        attributes: ['designacao']
      }]
    });

    
    const usersData =  users.map(utilizador => {
      return {
        id_utilizador: utilizador.id_utilizador,
        id_tipo_utilizador: utilizador.id_tipo_utilizador,
        tipo_utilizador: utilizador.TipoUtilizador.designacao,
        nome: utilizador.nome,
        email: utilizador.email,
        data_criacao: utilizador.data_criacao,
        ultimo_login: utilizador.ultimo_login,
        primeiro_login: utilizador.primeiro_login,
        url_foto_perfil: utilizador.url_foto_perfil,
        biografia: utilizador.biografia,
        departamento: utilizador.departamento,
        area_preferidas: utilizador.area_preferidas
      };
    });


    res.json(usersData);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao buscar utilizadores' });
  }
};

// Get all users type
const getAllUsersType = async (req, res) => {
  try {
    const users = await TipoUtilizador.findAll()
    res.json(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao buscar tipos de utilizadores' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await Utilizadores.findByPk(req.params.id, {
      include: [{
        model: TipoUtilizador,
        attributes: ['designacao']
      },
      {
        model: InscricoesOcorrencia,
        include: [{
          model: OcorrenciasCurso,
          include: [{
            model: Cursos,
            include: [Topicos]
          }]
        }]
      }
    ]
    });
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    const usersData =  {
        id_utilizador: user.id_utilizador,
        id_tipo_utilizador: user.id_tipo_utilizador,
        tipo_utilizador: user.TipoUtilizador.designacao,
        nome: user.nome,
        email: user.email,
        data_criacao: user.data_criacao,
        ultimo_login: user.ultimo_login,
        primeiro_login: user.primeiro_login,
        url_foto_perfil: user.url_foto_perfil,
        biografia: user.biografia,
        departamento: user.departamento,
        area_preferidas: user.area_preferidas,
        InscricoesOcorrencia: user.InscricoesOcorrencia,  
      };

    res.json(usersData);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao buscar utilizador' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await Utilizadores.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    const { nome, email, id_tipo_utilizador } = req.body;

    let {url_foto_perfil } = req.body
    const profilepic = req.files['url_foto_perfil']?.[0];
    
    if(profilepic){
      const uploadResponse = await cloudinary.uploader.upload(profilepic.path, {
        upload_preset: "pint",
      });
      if(uploadResponse){
        await destruirArquivoAnterior(user.url_foto_perfil.secure_url);
      }
      url_foto_perfil = {
        secure_url: uploadResponse.secure_url,
        url: uploadResponse.url,
      }
    }
    
    await user.update({
      nome,
      email,
      id_tipo_utilizador,
      url_foto_perfil
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao actualizar utilizador' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await Utilizadores.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    if(user.url_foto_perfil.secure_url){
      await destruirArquivoAnterior(user.url_foto_perfil.secure_url);
    }

    await user.destroy();
    res.json({ message: 'Utilizador eliminado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao eliminar utilizador' });
  }
};

// Get user courses
const getUserCourses = async (req, res) => {
  try {
    const user = await Utilizadores.findByPk(req.params.id, {
      include: [{
        model: InscricoesOcorrencia,
        include: [{
          model: OcorrenciasCurso,
          include: [{
            model: Cursos,
            include: [Topicos]
          }]
        }]
      }]
    });

    const cursos = user.InscricoesOcorrencia.map(inscricao => {
      const curso = inscricao.OcorrenciasCurso?.Curso;
      return {
        id_curso: curso?.id_curso,
        titulo: curso?.titulo?.trim(),  
        descricao: curso?.descricao,
        id_topico: curso?.id_topico,
        nome_topico: curso?.Topico?.nome?.trim(),  
        url_capa: curso?.url_capa,
        url_icon: curso?.url_icon,
        data_criacao: curso?.data_criacao,
        ultima_atualizacao: curso?.ultima_atualizacao
      };
    }).filter(curso => curso); 

    if(cursos.length === 0){
      return res.status(404).json({ error: 'Esse utilizador não tem nenhum curso inscrito.' });
    }
    res.json({nome: user.nome, cursos});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao buscar cursos do utilizador' });
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsersType,
  getUserCourses,  
};
