const { PartilhasConhecimento, Denuncias, NotificacoesForum, Topicos,ConteudoPartilha} = require('../models');
const cloudinary = require('../config/cloudinary');
const path = require('path');
// Get all forum posts
const getAllPosts = async (req, res) => {
  try {
    const allPosts = await PartilhasConhecimento.findAll({
      include: [Denuncias, Topicos, NotificacoesForum,ConteudoPartilha],
      order: [['id_partilha', 'ASC']]
    });
    
    function buildTree(items, parentId = null) {
      return items
        .filter(item => item.sub_partilha === parentId)
        .map(item => ({
          ...item.toJSON(),
          comentarios: buildTree(items, item.id_partilha)
        }));
    }
    
    const tree = buildTree(allPosts, null);
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
      include: [Denuncias, Topicos, NotificacoesForum,ConteudoPartilha],
      order: [['id_partilha', 'ASC']]
    });
    
    function buildTree(items, parentId = null) {
      return items
        .filter(item => item.sub_partilha === parentId)
        .map(item => ({
          ...item.toJSON(),
          comentarios: buildTree(items, item.id_partilha)
        }));
    }
    
    const tree = buildTree(allPosts, null);
    const post = tree.find(post => post.id_partilha === parseInt(req.params.id));

    if(!post){
      return res.status(404).json({ error: 'Comentário não encontrado' });
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
    let { id_topico, id_utilizador, sub_partilha, titulo, conteudo } = req.body;

    const pdfFile = req.files['url_pdf']?.[0];
    const imageFile = req.files['url_imagem']?.[0];
    let url_pdf = null;
    let url_imagem = null;
    let conteudo_pdf = null;
    let conteudo_imagem = null;

    
    //teste
    id_topico = 1;
    id_utilizador = 4;
    sub_partilha = null;
    titulo = 'Teste';
    conteudo = 'Teste conteudo';
    
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
    
    res.status(201).json({post, conteudo_pdf, conteudo_imagem});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating post' });
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
    res.status(500).json({ error: 'Error denouncing post' });
  }
};

// Update forum post
const updatePost = async (req, res) => {
  try {

    const { titulo, conteudo } = req.body;

    const pdfFile = req.files['url_pdf']?.[0];
    const imageFile = req.files['url_imagem']?.[0];
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

    res.json({post, conteudo_pdf, conteudo_imagem});
  } catch (error) {
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
      const url = content.conteudo.secure_url;

      const publicIdWithExt = url.split('/upload/')[1];
      const publicIdWithoutVersion = publicIdWithExt.replace(/^v\d+\//, '')
      const publicId =  content.tipo_conteudo === 'pdf' ? decodeURIComponent(publicIdWithoutVersion) : decodeURIComponent(publicIdWithoutVersion.replace(/\.[^/.]+$/, ''));

      const resourceType = content.tipo_conteudo === 'pdf' ? 'raw' : 'image';
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      
    }

    await content.destroy();
    res.json({ message: 'Ficheiro eliminado com sucesso' });
  } catch (error) {
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

    await post.destroy();
    res.json({ message: 'Comentário eliminado com sucesso' });
  } catch (error) {
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
