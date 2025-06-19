module.exports = (sequelize, DataTypes) => {
  const PartilhasConhecimento = sequelize.define('PartilhasConhecimento', {
    id_partilha: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sub_partilha: {
      type: DataTypes.INTEGER
    },
    id_topico: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(256)
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    classificacao: {
      type: DataTypes.INTEGER
    },
    denunciado: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    tableName: 'partilhas_conhecimento',
    timestamps: false
  });

  return PartilhasConhecimento;
};
