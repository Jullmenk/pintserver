module.exports = (sequelize, DataTypes) => {
  const Utilizadores = sequelize.define('Utilizadores', {
    id_utilizador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_tipo_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true
    },
    passe: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    ultimo_login: {
      type: DataTypes.DATE
    },
    primeiro_login: {
      type: DataTypes.DATE
    },
    url_foto_perfil: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        url: "",
        secure_url: ""
      }
    },
    biografia: {
      type: DataTypes.STRING(1024)
    },
    departamento: {
      type: DataTypes.STRING(100)
    },
    area_preferidas: {
      type: DataTypes.STRING(1024)
    }
  }, {
    tableName: 'utilizadores',
    timestamps: false
  });

  return Utilizadores;
};
