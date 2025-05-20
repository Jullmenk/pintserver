module.exports = (sequelize, DataTypes) => {
  const NotificacoesForum = sequelize.define('NotificacoesForum', {
    id_notificacao_forum: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_partilha: {
      type: DataTypes.INTEGER
    },
    titulo: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    conteudo: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    data_criacao: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'notificacoes_forum',
    timestamps: false
  });

  return NotificacoesForum;
};
