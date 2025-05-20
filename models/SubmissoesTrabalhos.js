module.exports = (sequelize, DataTypes) => {
  const SubmissoesTrabalhos = sequelize.define('SubmissoesTrabalhos', {
    id_submissao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_trabalho: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_submissao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pontuacao: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    feedback: {
      type: DataTypes.STRING(1024)
    },
    url_trabalho: {
      type: DataTypes.STRING(1024),
      allowNull: false
    }
  }, {
    tableName: 'submissoes_trabalhos',
    timestamps: false
  });

  return SubmissoesTrabalhos;
};
