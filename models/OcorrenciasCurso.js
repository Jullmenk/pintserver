module.exports = (sequelize, DataTypes) => {
  const OcorrenciasCurso = sequelize.define('OcorrenciasCurso', {
    id_ocorrencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_curso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_utilizador: {
      type: DataTypes.INTEGER
    },
    tipo_ocorrencia: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    data_inicio: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    data_fim: {
      type: DataTypes.DATE
    },
    estado: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
      allowNull: false
    },
    data_limite_inscricao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    total_horas: {
      type: DataTypes.INTEGER
    },
    vagas_disponiveis: {
      type: DataTypes.INTEGER
    },
    horario: {
      type: DataTypes.STRING(1024)
    }
  }, {
    tableName: 'ocorrencias_curso',
    timestamps: false
  });

  return OcorrenciasCurso;
};
