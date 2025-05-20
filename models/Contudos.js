module.exports = (sequelize, DataTypes) => {
  const Contudos = sequelize.define('Contudos', {
    id_conteudo: {
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
    conteudo: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    tipo_conteudo: {
      type: DataTypes.STRING(50)
    },
    estado: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
      allowNull: false
    }
  }, {
    tableName: 'conteudos',
    timestamps: false
  });

  return Contudos;
};
