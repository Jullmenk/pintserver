const { Topicos, Areas, Categorias } = require('../models');


const getAllCategories = async (req, res) => {
  try {
    const categories = await Categorias.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
}

const getAllAreas = async (req, res) => {
  try {
    const areas = await Areas.findAll();
    res.json(areas);
  } catch (error) {
    console.error('Erro ao buscar areas:', error);
    res.status(500).json({ error: 'Error fetching areas' });
  }
}

const getAllTopics = async (req, res) => {
  try {
    const topics = await Topicos.findAll();
    res.json(topics);
  } catch (error) {
    console.error('Erro ao buscar topics:', error);
    res.status(500).json({ error: 'Error fetching topics' });
  }
}


module.exports = {
  getAllCategories,
  getAllAreas,
  getAllTopics,
};
