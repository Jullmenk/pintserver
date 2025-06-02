module.exports = (sequelize, DataTypes) => {
  const Cursos = sequelize.define('Cursos', {
    id_curso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_topico: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    estado: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
      allowNull: false
    },
    url_capa: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        url: "",
        secure_url: ""
      }
    },
    url_icon: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        url: "",
        secure_url: ""
      }
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    ultima_atualizacao: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, {
    tableName: 'cursos',
    timestamps: false
  });

  return Cursos;
};
