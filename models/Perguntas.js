module.exports = (sequelize, DataTypes) => {
  const Perguntas = sequelize.define('Perguntas', {
    id_pergunta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_quizz: {
      type: DataTypes.INTEGER
    },
    pergunta: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    pontuacao: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'perguntas',
    timestamps: false
  });

  return Perguntas;
};
