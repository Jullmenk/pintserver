module.exports = (sequelize, DataTypes) => {
  const InscricoesOcorrencia = sequelize.define('InscricoesOcorrencia', {
    id_inscricao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_ocorrencia: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_inscricao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
      allowNull: false
    },
    avaliacao: {
      type: DataTypes.STRING(100)
    }
  }, {
    tableName: 'inscricoes_ocorrencia',
    timestamps: false
  });

  return InscricoesOcorrencia;
};
