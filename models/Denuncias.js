module.exports = (sequelize, DataTypes) => {
  const Denuncias = sequelize.define('Denuncias', {
    id_denuncia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_partilha: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_utilizador: {
      type: DataTypes.INTEGER
    },
    descricao: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, {
    tableName: 'denuncias',
    timestamps: false
  });

  return Denuncias;
};
