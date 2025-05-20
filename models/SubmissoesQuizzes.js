module.exports = (sequelize, DataTypes) => {
  const SubmissoesQuizzes = sequelize.define('SubmissoesQuizzes', {
    id_submissao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_quizz: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_submissao: {
      type: DataTypes.DATE
    },
    pontuacao: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'submissoes_quizzes',
    timestamps: false
  });

  return SubmissoesQuizzes;
};
