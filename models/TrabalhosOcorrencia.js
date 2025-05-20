module.exports = (sequelize, DataTypes) => {
  const TrabalhosOcorrencia = sequelize.define('TrabalhosOcorrencia', {
    id_trabalho: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_ocorrencia: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING(1024)
    },
    data_entrega: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, {
    tableName: 'trabalhos_ocorrencia',
    timestamps: false
  });

  return TrabalhosOcorrencia;
};
