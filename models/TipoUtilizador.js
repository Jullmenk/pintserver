module.exports = (sequelize, DataTypes) => {
  const TipoUtilizador = sequelize.define('TipoUtilizador', {
    id_tipo_utilizador: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    designacao: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING(1024)
    }
  }, {
    tableName: 'tipo_utilizador',
    timestamps: false
  });

  return TipoUtilizador;
};
