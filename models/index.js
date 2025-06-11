const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
require('dotenv').config();
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
const Categorias = require('./Categorias')(sequelize, Sequelize.DataTypes);
const Areas = require('./Areas')(sequelize, Sequelize.DataTypes);
const Topicos = require('./Topicos')(sequelize, Sequelize.DataTypes);
const TipoUtilizador = require('./TipoUtilizador')(sequelize, Sequelize.DataTypes);
const Utilizadores = require('./Utilizadores')(sequelize, Sequelize.DataTypes);
const Cursos = require('./Cursos')(sequelize, Sequelize.DataTypes);
const Avaliacoes = require('./Avaliacoes')(sequelize, Sequelize.DataTypes);
const OcorrenciasCurso = require('./OcorrenciasCurso')(sequelize, Sequelize.DataTypes);
const Contudos = require('./Contudos')(sequelize, Sequelize.DataTypes);
const PartilhasConhecimento = require('./PartilhasConhecimento')(sequelize, Sequelize.DataTypes);
const Denuncias = require('./Denuncias')(sequelize, Sequelize.DataTypes);
const InscricoesOcorrencia = require('./InscricoesOcorrencia')(sequelize, Sequelize.DataTypes);
const NotificacoesForum = require('./NotificacoesForum')(sequelize, Sequelize.DataTypes);
const NotificacoesOcorrencia = require('./NotificacoesOcorrencia')(sequelize, Sequelize.DataTypes);
const Quizzes = require('./Quizzes')(sequelize, Sequelize.DataTypes);
const Perguntas = require('./Perguntas')(sequelize, Sequelize.DataTypes);
const Respostas = require('./Respostas')(sequelize, Sequelize.DataTypes);
const SubmissoesQuizzes = require('./SubmissoesQuizzes')(sequelize, Sequelize.DataTypes);
const TrabalhosOcorrencia = require('./TrabalhosOcorrencia')(sequelize, Sequelize.DataTypes);
const SubmissoesTrabalhos = require('./SubmissoesTrabalhos')(sequelize, Sequelize.DataTypes);

// Add models to db object
db.Categorias = Categorias;
db.Areas = Areas;
db.Topicos = Topicos;
db.TipoUtilizador = TipoUtilizador;
db.Utilizadores = Utilizadores;
db.Cursos = Cursos;
db.Avaliacoes = Avaliacoes;
db.OcorrenciasCurso = OcorrenciasCurso;
db.Contudos = Contudos;
db.PartilhasConhecimento = PartilhasConhecimento;
db.Denuncias = Denuncias;
db.InscricoesOcorrencia = InscricoesOcorrencia;
db.NotificacoesForum = NotificacoesForum;
db.NotificacoesOcorrencia = NotificacoesOcorrencia;
db.Quizzes = Quizzes;
db.Perguntas = Perguntas;
db.Respostas = Respostas;
db.SubmissoesQuizzes = SubmissoesQuizzes;
db.TrabalhosOcorrencia = TrabalhosOcorrencia;
db.SubmissoesTrabalhos = SubmissoesTrabalhos;

// Define associations
// Categorias -> Areas
Categorias.hasMany(Areas, { foreignKey: 'id_categoria' });
Areas.belongsTo(Categorias, { foreignKey: 'id_categoria' });

// Areas -> Topicos
Areas.hasMany(Topicos, { foreignKey: 'id_area' });
Topicos.belongsTo(Areas, { foreignKey: 'id_area' });

// TipoUtilizador -> Utilizadores
TipoUtilizador.hasMany(Utilizadores, { foreignKey: 'id_tipo_utilizador' });
Utilizadores.belongsTo(TipoUtilizador, { foreignKey: 'id_tipo_utilizador' });

// Topicos -> Cursos
Topicos.hasMany(Cursos, { foreignKey: 'id_topico' });
Cursos.belongsTo(Topicos, { foreignKey: 'id_topico' });

// Utilizadores -> Avaliacoes
Utilizadores.hasMany(Avaliacoes, { foreignKey: 'id_utilizador' });
Avaliacoes.belongsTo(Utilizadores, { foreignKey: 'id_utilizador' });

// Cursos -> Avaliacoes
Cursos.hasMany(Avaliacoes, { foreignKey: 'id_curso' });
Avaliacoes.belongsTo(Cursos, { foreignKey: 'id_curso' });

// Cursos -> OcorrenciasCurso
Cursos.hasMany(OcorrenciasCurso, { foreignKey: 'id_curso' });
OcorrenciasCurso.belongsTo(Cursos, { foreignKey: 'id_curso' });

// Utilizadores -> OcorrenciasCurso
Utilizadores.hasMany(OcorrenciasCurso, { foreignKey: 'id_utilizador' });
OcorrenciasCurso.belongsTo(Utilizadores, { foreignKey: 'id_utilizador' });

// OcorrenciasCurso -> Contudos
OcorrenciasCurso.hasMany(Contudos, { foreignKey: 'id_ocorrencia' });
Contudos.belongsTo(OcorrenciasCurso, { foreignKey: 'id_ocorrencia' });

// Topicos -> PartilhasConhecimento
Topicos.hasMany(PartilhasConhecimento, { foreignKey: 'id_topico' });
PartilhasConhecimento.belongsTo(Topicos, { foreignKey: 'id_topico' });

PartilhasConhecimento.hasMany(PartilhasConhecimento, {
    foreignKey: 'sub_partilha',
    as: 'comentarios'
  });
  
  PartilhasConhecimento.belongsTo(PartilhasConhecimento, {
    foreignKey: 'sub_partilha',
    as: 'parent'
  });

// Utilizadores -> PartilhasConhecimento
Utilizadores.hasMany(PartilhasConhecimento, { foreignKey: 'id_utilizador' });
PartilhasConhecimento.belongsTo(Utilizadores, { foreignKey: 'id_utilizador' });

// PartilhasConhecimento -> Denuncias
PartilhasConhecimento.hasMany(Denuncias, { foreignKey: 'id_partilha' });
Denuncias.belongsTo(PartilhasConhecimento, { foreignKey: 'id_partilha' });

// Utilizadores -> Denuncias
Utilizadores.hasMany(Denuncias, { foreignKey: 'id_utilizador' });
Denuncias.belongsTo(Utilizadores, { foreignKey: 'id_utilizador' });

// OcorrenciasCurso -> InscricoesOcorrencia
OcorrenciasCurso.hasMany(InscricoesOcorrencia, { foreignKey: 'id_ocorrencia' });
InscricoesOcorrencia.belongsTo(OcorrenciasCurso, { foreignKey: 'id_ocorrencia' });

// Utilizadores -> InscricoesOcorrencia
Utilizadores.hasMany(InscricoesOcorrencia, { foreignKey: 'id_utilizador' });
InscricoesOcorrencia.belongsTo(Utilizadores, { foreignKey: 'id_utilizador' });

// PartilhasConhecimento -> NotificacoesForum
PartilhasConhecimento.hasMany(NotificacoesForum, { foreignKey: 'id_partilha' });
NotificacoesForum.belongsTo(PartilhasConhecimento, { foreignKey: 'id_partilha' });

// OcorrenciasCurso -> NotificacoesOcorrencia
OcorrenciasCurso.hasMany(NotificacoesOcorrencia, { foreignKey: 'id_ocorrencia' });
NotificacoesOcorrencia.belongsTo(OcorrenciasCurso, { foreignKey: 'id_ocorrencia' });

// OcorrenciasCurso -> Quizzes
OcorrenciasCurso.hasMany(Quizzes, { foreignKey: 'id_ocorrencia' });
Quizzes.belongsTo(OcorrenciasCurso, { foreignKey: 'id_ocorrencia' });

// Quizzes -> Perguntas
Quizzes.hasMany(Perguntas, { foreignKey: 'id_quizz' });
Perguntas.belongsTo(Quizzes, { foreignKey: 'id_quizz' });

// Perguntas -> Respostas
Perguntas.hasMany(Respostas, { foreignKey: 'id_pergunta' });
Respostas.belongsTo(Perguntas, { foreignKey: 'id_pergunta' });

// Utilizadores -> SubmissoesQuizzes
Utilizadores.hasMany(SubmissoesQuizzes, { foreignKey: 'id_utilizador' });
SubmissoesQuizzes.belongsTo(Utilizadores, { foreignKey: 'id_utilizador' });

// Quizzes -> SubmissoesQuizzes
Quizzes.hasMany(SubmissoesQuizzes, { foreignKey: 'id_quizz' });
SubmissoesQuizzes.belongsTo(Quizzes, { foreignKey: 'id_quizz' });

// OcorrenciasCurso -> TrabalhosOcorrencia
OcorrenciasCurso.hasMany(TrabalhosOcorrencia, { foreignKey: 'id_ocorrencia' });
TrabalhosOcorrencia.belongsTo(OcorrenciasCurso, { foreignKey: 'id_ocorrencia' });

// TrabalhosOcorrencia -> SubmissoesTrabalhos
TrabalhosOcorrencia.hasMany(SubmissoesTrabalhos, { foreignKey: 'id_trabalho' });
SubmissoesTrabalhos.belongsTo(TrabalhosOcorrencia, { foreignKey: 'id_trabalho' });

// Utilizadores -> SubmissoesTrabalhos
Utilizadores.hasMany(SubmissoesTrabalhos, { foreignKey: 'id_utilizador' });
SubmissoesTrabalhos.belongsTo(Utilizadores, { foreignKey: 'id_utilizador' });


module.exports = db;
