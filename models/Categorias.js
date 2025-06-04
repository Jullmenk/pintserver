module.exports = (sequelize, DataTypes) => {
  const Categorias = sequelize.define('Categorias', {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING(1024)
    },
    estado: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
      allowNull: false
    }
  }, {
    tableName: 'categorias',
    timestamps: false
  });

  return Categorias;
};
