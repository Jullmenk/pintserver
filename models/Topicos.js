module.exports = (sequelize, DataTypes) => {
  const Topicos = sequelize.define('Topicos', {
    id_topico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_area: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(256)
    },
    descricao: {
      type: DataTypes.STRING(1024)
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    estado: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
      allowNull: false
    }
  }, {
    tableName: 'topicos',
    timestamps: false
  });

  return Topicos;
};
