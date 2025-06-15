const { Cursos, OcorrenciasCurso, Utilizadores, NotificacoesOcorrencia } = require('../models');

/* cursos estados : 1 - ativo | 0 - inativo
ocorrencias estados : 1 - ativo | 0 - inativo
inscricoes estados : 1 - concluida | 0 - em andamento
*/

const createOcorrencia = async (req, res) => {
    try {
    const { id_curso, id_utilizador, tipo_ocorrencia, data_inicio, data_fim, vagas_disponiveis, data_limite_inscricao, total_horas, horario } = req.body;

    if(new Date(data_inicio) >= new Date(data_fim)){
      return res.status(400).json({ error: 'Data de inicio deve ser menor que data de fim' });
    }

    if(tipo_ocorrencia !== "Síncrono" && tipo_ocorrencia !== "Assíncrono"){
      return res.status(400).json({ error: 'Tipo de ocorrência deve ser Síncrono ou Assíncrono' });
    }

    if(tipo_ocorrencia ==="Síncrono" && (horario === null || horario === "")){
      return res.status(400).json({ error: 'Sendo um curso síncrono, horario deve ser informado' });
    }

    if(tipo_ocorrencia === "Síncrono" && (vagas_disponiveis === null || vagas_disponiveis === "")){
      return res.status(400).json({ error: 'Sendo um curso síncrono, vagas disponiveis deve ser informada' });
    }

    if(data_limite_inscricao === null || data_limite_inscricao === ""){
      return res.status(400).json({ error: 'Data do limite de inscricao deve ser informada' });
    }

    if(new Date(data_limite_inscricao) >= new Date(data_inicio)){
      return res.status(400).json({ error: 'Data do limite de inscricao deve ser menor que data de inicio' });
    }

    const curso = await Cursos.findByPk(id_curso);
    if (!curso) {
      return res.status(404).json({ error: 'Curso nao encontrado' });
    }

    if(curso.estado === 0){
      return res.status(400).json({ error: 'Esse curso não está disponivel para criar ocorrências' });
    }

    const user = await Utilizadores.findByPk(id_utilizador);
    if (!user) {
      return res.status(404).json({ error: 'Utilizador nao encontrado' });
    }

    if(user.id_tipo_utilizador === 3){
      return res.status(403).json({ error: 'Apenas formandos e administradores podem criar ocorrências' });
    }

    const ocorrencia = await OcorrenciasCurso.create({
      id_curso,
      data_inicio,
      data_fim,
      vagas_disponiveis,
      tipo_ocorrencia,
      data_limite_inscricao,
      estado: 1,
      id_utilizador,
      total_horas,
      horario
    })

    res.json(ocorrencia);
  } catch (error) {
    console.error('Erro ao criar ocorrência:', error);
    res.status(500).json({ error: 'Error creating ocorrencia' });
  }
}

const deleteOcorrencia = async (req, res) => {
  try {
    const ocorrencia = await OcorrenciasCurso.findByPk(req.params.id);
    if (!ocorrencia) {
      return res.status(404).json({ error: 'Ocorrência nao encontrada' });
    }

    await ocorrencia.destroy();
    res.json({ message: 'Ocorrência eliminada com sucesso' });
  } catch (error) {
    console.error('Erro ao eliminar ocorrência:', error);
    res.status(500).json({ error: 'Error deleting ocorrencia' });
  }
}

const updateOcorrencia = async (req, res) => {
  try {
    const { data_inicio,id_utilizador, id_curso, data_fim, vagas_disponiveis, data_limite_inscricao, estado, id_ocorrencia, tipo_ocorrencia, total_horas, horario } = req.body;
    
    if(estado !== 1 && estado !== 0){
      return res.status(400).json({ error: 'Estado invalido' });
    }

    const ocorrencia = await OcorrenciasCurso.findByPk(id_ocorrencia);
    if (!ocorrencia) {
      return res.status(404).json({ error: 'Ocorrência nao encontrada' });
    }


    if(tipo_ocorrencia !== "Síncrono" && tipo_ocorrencia !== "Assíncrono"){
      return res.status(400).json({ error: 'Tipo de ocorrência deve ser Síncrono ou Assíncrono' });
    }

    if(tipo_ocorrencia ==="Síncrono" && (horario === null || horario === "")){
      return res.status(400).json({ error: 'Sendo um curso síncrono, horario deve ser informado' });
    }

    if(tipo_ocorrencia === "Síncrono" && (vagas_disponiveis === null || vagas_disponiveis === "")){
      return res.status(400).json({ error: 'Sendo um curso síncrono, vagas disponiveis deve ser informada' });
    }

    if(new Date(data_inicio) > new Date(data_fim)){
      return res.status(400).json({ error: 'Data de inicio deve ser menor que data de fim' });
    }

    if(data_limite_inscricao === null || data_limite_inscricao === ""){
      return res.status(400).json({ error: 'Data do limite de inscricao deve ser informada' });
    }

    if(new Date(data_limite_inscricao) >= new Date(data_inicio)){
      return res.status(400).json({ error: 'Data do limite de inscricao deve ser menor que data de inicio' });
    }

    const curso = await Cursos.findByPk(ocorrencia.id_curso);
    if (!curso) {
      return res.status(404).json({ error: 'Curso nao encontrado' });
    }

    const user = await Utilizadores.findByPk(id_utilizador);
    if (!user) {
      return res.status(404).json({ error: 'Utilizador nao encontrado' });
    }

    if(user.id_tipo_utilizador === 3){
      return res.status(403).json({ error: 'Apenas formandos e administradores podem criar ocorrências' });
    }

    await ocorrencia.update({
      data_inicio,
      data_fim,
      vagas_disponiveis,
      data_limite_inscricao,
      estado,
      id_curso,
      tipo_ocorrencia,
      id_utilizador,
      total_horas,
      horario
    });

    const inscricoes = await InscricoesOcorrencia.findAll({
      where: { id_ocorrencia }
    });

    if(inscricoes){
      for (const inscricao of inscricoes) {
        const user = await Utilizadores.findByPk(inscricao.id_utilizador);
        notifyUser(user.email, `Olá ${user.nome}, houve uma alteração na ocorrência que está inscrito`, `Estamos a enviar esse email para informar que houve uma alteração na ocorrência que está inscrito do curso ${curso.titulo}, por favor verifique os dados da ocorrência.`,``)
      }
    }

    const Notificacoes = await NotificacoesOcorrencia.create({
      titulo: "Alteração na ocorrência",
      conteudo: `Houve uma alteração na ocorrência que está inscrito do curso ${curso.titulo}, por favor verifique os dados da ocorrência.`,
      id_ocorrencia,
    })

    res.json({ocorrencia, Notificacoes});
  } catch (error) {
    console.error('Erro ao actualizar ocorrência:', error);
    res.status(500).json({ error: 'Error updating ocorrencia' });
  }
}

module.exports = {
  createOcorrencia,
  updateOcorrencia,
  deleteOcorrencia
};
