## Many man 

SELECT setval('partilhas_conhecimento_id_partilha_seq', (SELECT MAX(id_partilha) FROM partilhas_conhecimento));
SELECT setval('denuncias_id_denuncia_seq', (SELECT MAX(id_denuncia) FROM denuncias));
SELECT setval('notificacoes_forum_id_notificacao_seq', (SELECT MAX(id_notificacao) FROM notificacoes_forum));
SELECT setval('respostas_id_resposta_seq', (SELECT MAX(id_resposta) FROM respostas));
SELECT setval('topicos_id_topico_seq', (SELECT MAX(id_topico) FROM topicos));
SELECT setval('quizzes_id_quiz_seq', (SELECT MAX(id_quiz) FROM quizzes));
SELECT setval('perguntas_id_pergunta_seq', (SELECT MAX(id_pergunta) FROM perguntas));
SELECT setval('submissoes_quizzes_id_submissao_seq', (SELECT MAX(id_submissao) FROM submissoes_quizzes));
SELECT setval('trabalhos_ocorrencia_id_trabalho_seq', (SELECT MAX(id_trabalho) FROM trabalhos_ocorrencia));
SELECT setval('submissoes_trabalhos_id_submissao_seq', (SELECT MAX(id_submissao) FROM submissoes_trabalhos));
SELECT setval('inscricoes_ocorrencia_id_inscricao_seq', (SELECT MAX(id_inscricao) FROM inscricoes_ocorrencia));


[] 