## Many man 

SELECT setval('utilizadores_id_utilizador_seq', (SELECT MAX(id_utilizador) FROM utilizadores));


[] 