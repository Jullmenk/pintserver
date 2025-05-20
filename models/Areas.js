module.exports = (sequelize, DataTypes) => {
  const Areas = sequelize.define('Areas', {
    id_area: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_categoria: {
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
    estado: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
      allowNull: false
    }
  }, {
    tableName: 'areas',
    timestamps: false
  });

  return Areas;
};
