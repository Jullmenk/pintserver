const { Utilizadores, TipoUtilizador } = require('../models');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Utilizadores.findAll({
      include: [{
        model: TipoUtilizador,
      }]
    });
    res.json(users);
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
    res.json(user);
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

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsersType
};
