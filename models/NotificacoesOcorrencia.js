module.exports = (sequelize, DataTypes) => {
  const NotificacoesOcorrencia = sequelize.define('NotificacoesOcorrencia', {
    id_notificacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_ocorrencia: {
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
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, {
    tableName: 'notificacoes_ocorrencia',
    timestamps: false
  });

  return NotificacoesOcorrencia;
};
