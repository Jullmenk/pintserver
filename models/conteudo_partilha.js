module.exports = (sequelize, DataTypes) => {
  const ConteudoPartilha = sequelize.define(
    "ConteudoPartilha",
    {
      id_conteudo_partilha: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_partilha: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      titulo: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      conteudo: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
          url: "",
          secure_url: "",
        },
      },
      tipo_conteudo: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: "conteudo_partilha",
      timestamps: false,
    }
  );

  return ConteudoPartilha;
};
