const { PartilhasConhecimento, Denuncias, NotificacoesForum, Respostas, Topicos } = require('../models');

// Get all forum posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await PartilhasConhecimento.findAll({
      include: [
        { model: Denuncias },
        { model: Topicos, attributes: ['id_topico', 'titulo'] },
        { model: NotificacoesForum },
      ]
    });

    const mapaPartilhas = {};

    posts.forEach(post => {
      const p = post.get({ plain: true }); // 💡 Transforma em objeto puro

      if (!p.sub_partilha) {
        mapaPartilhas[p.id_partilha] = { ...p, comentarios: [] };
      }
    });

    posts.forEach(post => {
      const p = post.get({ plain: true });

      if (p.sub_partilha) {
        if (mapaPartilhas[p.sub_partilha]) {
          mapaPartilhas[p.sub_partilha].comentarios.push(p);
        }
      }
    });

    res.json(Object.values(mapaPartilhas));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching forum posts' });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try { const posts = await PartilhasConhecimento.findAll({
    include: [
      { model: Denuncias },
      { model: Topicos, attributes: ['id_topico', 'titulo'] },
      { model: NotificacoesForum },
    ]
  });

  const mapaPartilhas = {};

  posts.forEach(post => {
    const p = post.get({ plain: true }); // 💡 Transforma em objeto puro

    if (!p.sub_partilha) {
      mapaPartilhas[p.id_partilha] = { ...p, comentarios: [] };
    }
  });

  posts.forEach(post => {
    const p = post.get({ plain: true });

    if (p.sub_partilha) {
      if (mapaPartilhas[p.sub_partilha]) {
        mapaPartilhas[p.sub_partilha].comentarios.push(p);
      }
    }
  });
  const post = mapaPartilhas[parseInt(req.params.id)];
  if (!post) {
    return res.status(404).json({ error: 'Post nao encontrado' });
  }
  res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching post' });
  }
};

// Create forum post
const createPost = async (req, res) => {
  try {
    const { id_topico, id_utilizador, sub_partilha, titulo, conteudo } = req.body;
    const post = await PartilhasConhecimento.create({
      id_topico,
      id_utilizador,
      sub_partilha,
      titulo,
      conteudo
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error creating post' });
  }
};

// Update forum post
const updatePost = async (req, res) => {
  try {
    const post = await PartilhasConhecimento.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { titulo, conteudo } = req.body;
    
    await post.update({
      titulo,
      conteudo
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error updating post' });
  }
};

// Delete forum post
const deletePost = async (req, res) => {
  try {
    const post = await PartilhasConhecimento.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};

// Create notification
const createNotification = async (req, res) => {
  try {
    const { id_partilha, titulo, conteudo } = req.body;
    const notification = await NotificacoesForum.create({
      id_partilha,
      titulo,
      conteudo
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error creating notification' });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  createNotification
};
