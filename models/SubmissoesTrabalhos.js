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
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    pontuacao: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    feedback: {
      type: DataTypes.STRING(1024)
    },
    url_trabalho: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        url: "",
        secure_url: "",
      },
    }
  }, {
    tableName: 'submissoes_trabalhos',
    timestamps: false
  });

  return SubmissoesTrabalhos;
};
