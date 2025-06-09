const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilizadores } = require('../models');
const { emailVerify } = require('../email/email');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { nome, email, passe, id_tipo_utilizador } = req.body;
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isManager = await Utilizadores.findOne({ where: { id_utilizador: decoded.id } });
    if (!isManager) {
      return res.status(400).json({ error: 'Gestor nao encontrado' });
    }
    
    if (isManager.id_tipo_utilizador !== 1) {
      return res.status(400).json({ error: 'So é permitido criar utilizadores aos gestores' });
    }

    // Check if user already exists
    const existingUser = await Utilizadores.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já existe' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(passe, 8);

    // Create user
    const user = await Utilizadores.create({
      nome,
      email,
      passe: hashedPassword,
      id_tipo_utilizador
    });

    const now = Math.floor(Date.now() / 1000); 
    const expiresInSeconds = 24 * 60 * 60;

    const userToken = jwt.sign(
      { id: user.id_utilizador,exp: now + expiresInSeconds },
      process.env.JWT_SECRET,
    );

    if(user){
      const link = `${process.env.FRONTEND_URL}/confirm-email?token=${userToken}`;
      await emailVerify(link, user.email); 
    }

  res.status(201).json({
      user: {
        id: user.id_utilizador,
        nome: user.nome,
        email: user.email,
        tipo_utilizador: user.id_tipo_utilizador
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error registering user' });
  }
};

const login = async (req, res) => {
  try {
    const { email, passe, logintype } = req.body;


    const user = await Utilizadores.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if(user.primeiro_login == null){
      return res.status(401).json({ error: 'Utilizador nao verificado' });
    }
    
    const isValidPassword = await bcrypt.compare(passe, user.passe);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const now = Math.floor(Date.now() / 1000);
    const expiresInSeconds = 24 * 60 * 60;

    if (user.primeiro_login === null) {
      user.ultimo_login = new Date();
      await user.save();
    }

    let type;
    if(logintype === 'formando'){
      type = 3;
    }else{
      type = user.id_tipo_utilizador;
    }
    
    const token = jwt.sign(
      {
        id: user.id_utilizador,
        exp: now + expiresInSeconds,
        tipo_utilizador: type
      },
      process.env.JWT_SECRET
    );

    res.json({
      user: {
        id: user.id_utilizador,
        nome: user.nome,
        email: user.email,
        tipo_utilizador: type
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

const validateTokenUserFirstLogin = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    if(decoded.exp<Date.now()/1000){
      return res.status(401).json({ error: 'Token expirado' });
    }

    const { novaPasse } = req.body;

    if (!novaPasse || novaPasse.length < 6) {
      return res.status(400).json({ error: 'A nova password deve ter pelo menos 6 caracteres' });
    }

    // Busca utilizador
    const user = await Utilizadores.findOne({ where: { id_utilizador: decoded.id } });
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    // Verifica se é primeiro login
    if (user.primeiro_login !== null) {
      return res.status(400).json({ error: 'Token não é válido para troca de password (não é o primeiro login)' });
    }

    // Faz hash da nova password
    const hashedPassword = await bcrypt.hash(novaPasse, 12);

    // Atualiza password 
    user.passe = hashedPassword;
    user.primeiro_login = new Date();

    await user.save();

    res.json({ success: true, message: 'Password atualizada com sucesso' });

  } catch (error) {
    res.status(401).json({ valid: false, error: 'Algo de errado aconteceu, lamentamos' });
  }
};


const validateToken = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.exp<Date.now()/1000){
      return res.status(401).json({ error: 'Token expirado' });
    }
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Algo de errado aconteceu, lamentamos' });
  }
};

module.exports = {
  register,
  login,
  validateToken,
  validateTokenUserFirstLogin
};
