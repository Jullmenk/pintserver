const { PartilhasConhecimento, Denuncias, NotificacoesForum, Topicos,ConteudoPartilha, Utilizadores, Cursos} = require('../models');
const cloudinary = require('../config/cloudinary');
const { destruirArquivoAnterior } = require('../lib/utils');
const path = require('path');
const { Op } = require('sequelize');
// Get all forum posts
const getAllPosts = async (req, res) => {
  try {
    const allPosts = await PartilhasConhecimento.findAll({
      include: [Denuncias, Topicos, NotificacoesForum,ConteudoPartilha,Utilizadores],
      order: [['id_partilha', 'ASC']]
    });
    
    const posts = allPosts.map((post) => {
      const plainPost = post.toJSON();

      const utilizador = plainPost.Utilizadore || {};
      const sanitizedUtilizador = {
        nome: utilizador.nome?.trim() || null,
        url_foto_perfil: utilizador.url_foto_perfil?.url || null,
      };

      delete plainPost.Utilizadore;
      delete plainPost.passe;

      return {
        ...plainPost,
        Utilizador: sanitizedUtilizador,
      };
    });
    

    function buildTree(items, parentId = null) {
      return items
        .filter(item => item.sub_partilha === parentId)
        .map(item => ({
          ...item,
          comentarios: buildTree(items, item.id_partilha)
        }));
    }
    
    const tree = buildTree(posts, null);
    res.json(tree);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching forum posts' });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try { 
    const allPosts = await PartilhasConhecimento.findAll({
      include: [Denuncias, Topicos, NotificacoesForum,ConteudoPartilha,Utilizadores],
      order: [['id_partilha', 'ASC']]
    });
    
    const posts = allPosts.map((post) => {
      const plainPost = post.toJSON();

      const utilizador = plainPost.Utilizadore || {};
      const sanitizedUtilizador = {
        nome: utilizador.nome?.trim() || null,
        url_foto_perfil: utilizador.url_foto_perfil?.url || null,
      };

      delete plainPost.Utilizadore;
      delete plainPost.passe;

      return {
        ...plainPost,
        Utilizador: sanitizedUtilizador,
      };
    });

    function buildTree(items, parentId = null) {
      return items
        .filter(item => item.sub_partilha === parentId)
        .map(item => ({
          ...item,
          comentarios: buildTree(items, item.id_partilha)
        }));
    }

    const tree = buildTree(posts, null);
    const post = tree.find(post => post.id_partilha === parseInt(req.params.id));    
    if(!post){
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    let topicosRelacionados = await PartilhasConhecimento.findAll({
      where: {
        id_topico: post.id_topico,
        sub_partilha: null,
        id_partilha: { [Op.ne]: parseInt(req.params.id) }
      },
      include:[Utilizadores],
      order: [['id_partilha', 'ASC']]
    });

    topicosRelacionados = topicosRelacionados.map(topico => {
      const plainTopico = topico.toJSON();

      const utilizador = plainTopico.Utilizadore || {};
      const sanitizedUtilizador = {
        nome: utilizador.nome?.trim() || null,
        url_foto_perfil: utilizador.url_foto_perfil?.url || null,
      };

      delete plainTopico.Utilizadore;
      delete plainTopico.passe;

      return {
        ...plainTopico,
        Utilizador: sanitizedUtilizador,
      };
    });

    const curso = await Cursos.findOne({
      where: {
        id_topico: post.id_topico
      }
    });

    post.topicosRelacionados = topicosRelacionados;
    post.curso = curso;

    res.json(post);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching post' });
  }
};

// Create forum post
const createPost = async (req, res) => {
  try {
    let { id_topico, id_utilizador, sub_partilha, titulo, conteudo } = req.body;

    console.log(req.files)

    const pdfFile = req.files?.['url_pdf']?.[0] ?? null;
    const imageFile = req.files?.['url_imagem']?.[0] ?? null;
    let url_pdf = null;
    let url_imagem = null;
    let conteudo_pdf = null;
    let conteudo_imagem = null;

    const topico = await Topicos.findByPk(id_topico);
    if(!topico){
      return res.status(404).json({ error: 'Tópico não encontrado' });
    }
    
    if(pdfFile){
      const fileExtension = pdfFile.originalname.slice(-4).toLowerCase();
      if (fileExtension !== '.pdf') {
        return res.status(400).json({ error: 'Arquivo inválido, deve ser .pdf' });
      }

      const uploadResponse = await cloudinary.uploader.upload(pdfFile.path, {
        resource_type: 'raw',
        public_id: `docs/${path.parse(pdfFile.originalname).name}.pdf`, 
        upload_preset: 'pint'
      });

      url_pdf = {
        secure_url: uploadResponse.secure_url,
        url: uploadResponse.url,
      }
    }
    
    if(imageFile){
      const fileExtension = imageFile.originalname.slice(-4).toLowerCase();
      if (fileExtension !== '.png' && fileExtension !== '.jpg' && fileExtension !== '.jpeg') {
        return res.status(400).json({ error: 'Arquivo inválido, deve ser .png, .jpg ou .jpeg' });
      }
      const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
        upload_preset: 'pint', 
      });

      url_imagem = {
        secure_url: uploadResponse.secure_url,
        url: uploadResponse.url,
      }
    }

    if(sub_partilha){
      titulo=null;
    }
    
    const post = await PartilhasConhecimento.create({
      id_topico,
      id_utilizador,
      sub_partilha,
      titulo,
      conteudo
    });

    if(url_pdf){
      conteudo_pdf = await ConteudoPartilha.create({
        id_partilha: post.id_partilha,
        conteudo:url_pdf,
        tipo_conteudo: 'pdf'
      });
    }
    
    if(url_imagem){
      conteudo_imagem = await ConteudoPartilha.create({
        id_partilha: post.id_partilha,
        conteudo:url_imagem,
        tipo_conteudo: 'img'
      });
    }
    
    res.status(201).json({post, ConteudoPartilhas:[conteudo_pdf, conteudo_imagem]});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
};

const denouncePost = async (req, res) => {
  try {
    const { id_partilha, id_utilizador, descricao } = req.body;

    const post = await PartilhasConhecimento.findByPk(id_partilha);
    if (!post) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    const denunciado = post.denunciado + 1;
    await post.update({
      denunciado
    });

    await post.save();

    const denounce = await Denuncias.create({
      id_partilha,
      id_utilizador,
      descricao
    });
    
    res.status(201).json(denounce);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error denouncing post' });
  }
};

// Update forum post
const updatePost = async (req, res) => {
  console.log(req.files)
  try {
    const { titulo, conteudo } = req.body;
    
    const pdfFile = req.files['url_pdf']?.[0] ?? null;
    const imageFile = req.files['url_imagem']?.[0] ?? null;
    let url_pdf = null;
    let url_imagem = null;
    let conteudo_pdf = null;
    let conteudo_imagem = null;

    const post = await PartilhasConhecimento.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    if(pdfFile){
      const uploadResponse = await cloudinary.uploader.upload(pdfFile.path, {
        resource_type: 'raw',
        public_id: `docs/${path.parse(pdfFile.originalname).name}.pdf`,
        upload_preset: 'pint'
      });
      
      url_pdf = {
        secure_url: uploadResponse.secure_url,
        url: uploadResponse.url,
      }
    }
    
    if(imageFile){
      const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
        upload_preset: 'pint', 
      });

      url_imagem = {
        secure_url: uploadResponse.secure_url,
        url: uploadResponse.url,
      }
    }

    if(url_pdf){
      conteudo_pdf = await ConteudoPartilha.create({
        id_partilha: post.id_partilha,
        conteudo:url_pdf,
        tipo_conteudo: 'pdf'
      });
    }
    
    if(url_imagem){
      conteudo_imagem = await ConteudoPartilha.create({
        id_partilha: post.id_partilha,
        conteudo:url_imagem,
        tipo_conteudo: 'img'
      });
    }
    
    await post.update({
      titulo,
      conteudo,
    });

    res.json({post, ConteudoPartilhas:[conteudo_pdf, conteudo_imagem]});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao atualizar comentário' });
  }
};

const deleteContent = async (req, res) => {
  try {
    const post = await PartilhasConhecimento.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    
    const content = await ConteudoPartilha.findByPk(req.params.id_conteudoPartilha);
    if (!content) {
      return res.status(404).json({ error: 'Ficheiro não encontrado' });
    }

    if (content.conteudo?.secure_url) {
      await destruirArquivoAnterior(content.conteudo.secure_url);
    }

    await content.destroy();
    res.json({ message: 'Ficheiro eliminado com sucesso' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao eliminar ficheiro' });
  }
};

// Delete forum post
const deletePost = async (req, res) => {
  try {
    const post = await PartilhasConhecimento.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    // Find all replies to this post
    const comentarios = await PartilhasConhecimento.findAll({
      where: {
        sub_partilha: req.params.id
      }
    });

    // Recursively delete all replies
    for (const comentario of comentarios) {
      await deletePost({ params: { id: comentario.id_partilha } }, { 
        status: () => ({ json: () => {} }),
        json: () => {}
      });
    }

    // Delete associated contents and their files
    const contents = await ConteudoPartilha.findAll({
      where: {
        id_partilha: req.params.id
      }
    });
    
    for (const content of contents) {
      if (content.conteudo?.secure_url) {
        await destruirArquivoAnterior(content.conteudo.secure_url);
      }
      await content.destroy();
    }

    // Delete the post itself
    await post.destroy();

    res.json({ message: 'Comentário eliminado com sucesso' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao eliminar comentário' });
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
    res.status(500).json({ error: 'Erro ao criar notificação' });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  createNotification,
  denouncePost,
  deleteContent
};
