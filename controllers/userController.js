const { Utilizadores, TipoUtilizador, Cursos, InscricoesOcorrencia, OcorrenciasCurso, Topicos } = require('../models');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Utilizadores.findAll({
      include: [{
        model: TipoUtilizador,
      }]
    });

    
    const usersData =  users.map(utilizador => {
      return {
        id_utilizador: utilizador.id_utilizador,
        nome: utilizador.nome,
        email: utilizador.email,
        url_foto_perfil: utilizador.url_foto_perfil,
        biografia: utilizador.biografia,
        departamento: utilizador.departamento,
        area_preferidas: utilizador.area_preferidas
      };
    });


    res.json(usersData);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching users' });
  }
};
const getAllUsersType = async (req, res) => {
  try {
    const users = await TipoUtilizador.findAll()
    res.json(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await Utilizadores.findByPk(req.params.id, {
      include: [{
        model: TipoUtilizador,
      }]
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const usersData =  user.map(utilizador => {
      return {
        id_utilizador: utilizador.id_utilizador,
        nome: utilizador.nome,
        email: utilizador.email,
        url_foto_perfil: utilizador.url_foto_perfil,
        biografia: utilizador.biografia,
        departamento: utilizador.departamento,
        area_preferidas: utilizador.area_preferidas
      };
    });

    res.json(usersData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await Utilizadores.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { nome, email, id_tipo_utilizador } = req.body;
    
    await user.update({
      nome,
      email,
      id_tipo_utilizador
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await Utilizadores.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
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
            include: [Topicos]  // <- Aqui é onde incluímos o nome do tópico
          }]
        }]
      }]
    });
    const cursos = user.InscricoesOcorrencia.map(inscricao => {
      const curso = inscricao.OcorrenciasCurso?.Curso;
      return {
        id_curso: curso?.id_curso,
        titulo: curso?.titulo?.trim(),  // remover espaços
        descricao: curso?.descricao,
        id_topico: curso?.id_topico,
        nome_topico: curso?.Topico?.nome?.trim(),  // Aqui buscamos o nome do tópico
        url_capa: curso?.url_capa,
        url_icon: curso?.url_icon,
        data_criacao: curso?.data_criacao,
        ultima_atualizacao: curso?.ultima_atualizacao
      };
    }).filter(curso => curso); // Remove undefined

    res.json(cursos);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching user courses' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsersType,
  getUserCourses
};
