module.exports = (sequelize, DataTypes) => {
  const Respostas = sequelize.define('Respostas', {
    id_resposta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_pergunta: {
      type: DataTypes.INTEGER
    },
    resposta: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    correta: {
      type: DataTypes.SMALLINT,
      allowNull: false
    }
  }, {
    tableName: 'respostas',
    timestamps: false
  });

  return Respostas;
};
