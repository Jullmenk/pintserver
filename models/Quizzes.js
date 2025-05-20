module.exports = (sequelize, DataTypes) => {
  const Quizzes = sequelize.define('Quizzes', {
    id_quizz: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_ocorrencia: {
      type: DataTypes.INTEGER
    },
    titulo: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tempo_limite: {
      type: DataTypes.TIME
    },
    capa: {
      type: DataTypes.STRING(50)
    },
    estado: {
      type: DataTypes.SMALLINT
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, {
    tableName: 'quizzes',
    timestamps: false
  });

  return Quizzes;
};
