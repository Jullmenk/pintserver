module.exports = (sequelize, DataTypes) => {
  const Avaliacoes = sequelize.define('Avaliacoes', {
    id_avaliacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_curso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comentario: {
      type: DataTypes.STRING(1024)
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, {
    tableName: 'avaliacoes',
    timestamps: false
  });

  return Avaliacoes;
};
