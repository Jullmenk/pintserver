const {
  Cursos,
  OcorrenciasCurso,
  Utilizadores,
  NotificacoesOcorrencia,
  SubmissoesTrabalhos,
  InscricoesOcorrencia,
  TrabalhosOcorrencia,
  Contudos,
} = require("../models");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const { notifyUser } = require("../email/email");
const { destruirArquivoAnterior } = require("../lib/utils");

/* cursos estados : 1 - ativo | 0 - inativo
ocorrencias estados : 1 - ativo | 0 - inativo
inscricoes estados : 1 - concluida | 0 - em andamento
*/

const createOcorrencia = async (req, res) => {
  try {
    const {
      id_curso,
      id_utilizador,
      tipo_ocorrencia,
      data_inicio,
      data_fim,
      vagas_disponiveis,
      data_limite_inscricao,
      total_horas,
      horario,
    } = req.body;

    if (new Date(data_inicio) >= new Date(data_fim)) {
      return res
        .status(400)
        .json({ error: "Data de inicio deve ser menor que data de fim" });
    }

    if (tipo_ocorrencia !== "Síncrono" && tipo_ocorrencia !== "Assíncrono") {
      return res
        .status(400)
        .json({ error: "Tipo de ocorrência deve ser Síncrono ou Assíncrono" });
    }

    if (
      tipo_ocorrencia === "Síncrono" &&
      (horario === null || horario === "")
    ) {
      return res
        .status(400)
        .json({ error: "Sendo um curso síncrono, horario deve ser informado" });
    }

    if (
      tipo_ocorrencia === "Síncrono" &&
      (vagas_disponiveis === null || vagas_disponiveis === "")
    ) {
      return res
        .status(400)
        .json({
          error:
            "Sendo um curso síncrono, vagas disponiveis deve ser informada",
        });
    }

    if (data_limite_inscricao === null || data_limite_inscricao === "") {
      return res
        .status(400)
        .json({ error: "Data do limite de inscricao deve ser informada" });
    }

    if (new Date(data_limite_inscricao) >= new Date(data_inicio)) {
      return res
        .status(400)
        .json({
          error:
            "Data do limite de inscricao deve ser menor que data de inicio",
        });
    }

    const curso = await Cursos.findByPk(id_curso);
    if (!curso) {
      return res.status(404).json({ error: "Curso nao encontrado" });
    }

    if (curso.estado === 0) {
      return res
        .status(400)
        .json({
          error: "Esse curso não está disponivel para criar ocorrências",
        });
    }

    const user = await Utilizadores.findByPk(id_utilizador);
    if (!user) {
      return res.status(404).json({ error: "Utilizador nao encontrado" });
    }

    if (user.id_tipo_utilizador === 3) {
      return res
        .status(403)
        .json({
          error: "Apenas formandos e administradores podem criar ocorrências",
        });
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
      horario,
    });

    res.json(ocorrencia);
  } catch (error) {
    console.error("Erro ao criar ocorrência:", error);
    res.status(500).json({ error: "Error creating ocorrencia" });
  }
};

const deleteOcorrencia = async (req, res) => {
  try {
    const ocorrencia = await OcorrenciasCurso.findByPk(req.params.id);
    if (!ocorrencia) {
      return res.status(404).json({ error: "Ocorrência nao encontrada" });
    }

    await ocorrencia.destroy();
    res.json({ message: "Ocorrência eliminada com sucesso" });
  } catch (error) {
    console.error("Erro ao eliminar ocorrência:", error);
    res.status(500).json({ error: "Error deleting ocorrencia" });
  }
};

const updateOcorrencia = async (req, res) => {
  try {
    const {
      data_inicio,
      id_utilizador,
      id_curso,
      data_fim,
      vagas_disponiveis,
      data_limite_inscricao,
      estado,
      id_ocorrencia,
      tipo_ocorrencia,
      total_horas,
      horario,
    } = req.body;

    if (estado !== 1 && estado !== 0) {
      return res.status(400).json({ error: "Estado invalido" });
    }

    const ocorrencia = await OcorrenciasCurso.findByPk(id_ocorrencia);
    if (!ocorrencia) {
      return res.status(404).json({ error: "Ocorrência nao encontrada" });
    }

    if (tipo_ocorrencia !== "Síncrono" && tipo_ocorrencia !== "Assíncrono") {
      return res
        .status(400)
        .json({ error: "Tipo de ocorrência deve ser Síncrono ou Assíncrono" });
    }

    if (
      tipo_ocorrencia === "Síncrono" &&
      (horario === null || horario === "")
    ) {
      return res
        .status(400)
        .json({ error: "Sendo um curso síncrono, horario deve ser informado" });
    }

    if (
      tipo_ocorrencia === "Síncrono" &&
      (vagas_disponiveis === null || vagas_disponiveis === "")
    ) {
      return res
        .status(400)
        .json({
          error:
            "Sendo um curso síncrono, vagas disponiveis deve ser informada",
        });
    }

    if (new Date(data_inicio) > new Date(data_fim)) {
      return res
        .status(400)
        .json({ error: "Data de inicio deve ser menor que data de fim" });
    }

    if (data_limite_inscricao === null || data_limite_inscricao === "") {
      return res
        .status(400)
        .json({ error: "Data do limite de inscricao deve ser informada" });
    }

    if (new Date(data_limite_inscricao) >= new Date(data_inicio)) {
      return res
        .status(400)
        .json({
          error:
            "Data do limite de inscricao deve ser menor que data de inicio",
        });
    }

    const curso = await Cursos.findByPk(ocorrencia.id_curso);
    if (!curso) {
      return res.status(404).json({ error: "Curso nao encontrado" });
    }

    const user = await Utilizadores.findByPk(id_utilizador);
    if (!user) {
      return res.status(404).json({ error: "Utilizador nao encontrado" });
    }

    if (user.id_tipo_utilizador === 3) {
      return res
        .status(403)
        .json({
          error: "Apenas formandos e administradores podem criar ocorrências",
        });
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
      horario,
    });

    const inscricoes = await InscricoesOcorrencia.findAll({
      where: { id_ocorrencia },
    });

    if (inscricoes) {
      for (const inscricao of inscricoes) {
        const user = await Utilizadores.findByPk(inscricao.id_utilizador);
        notifyUser(
          user.email,
          `Olá ${user.nome}, houve uma alteração na ocorrência que está inscrito`,
          `Estamos a enviar esse email para informar que houve uma alteração na ocorrência que está inscrito do curso ${curso.titulo}, por favor verifique os dados da ocorrência.`,
          ``
        );
      }
    }

    const Notificacoes = await NotificacoesOcorrencia.create({
      titulo: "Alteração na ocorrência",
      conteudo: `Houve uma alteração na ocorrência que está inscrito do curso ${curso.titulo}, por favor verifique os dados da ocorrência.`,
      id_ocorrencia,
    });

    res.json({ ocorrencia, Notificacoes });
  } catch (error) {
    console.error("Erro ao actualizar ocorrência:", error);
    res.status(500).json({ error: "Error updating ocorrencia" });
  }
};

const submeterTrabalho = async (req, res) => {
  const { id_ocorrencia, id_trabalho } = req.params;
  const { id_utilizador } = req.body;

  const ocorrencia = await OcorrenciasCurso.findByPk(id_ocorrencia);
  if (!ocorrencia) {
    return res.status(404).json({ error: "Ocorrência nao encontrada" });
  }

  const trabalhoOcorrencia = await TrabalhosOcorrencia.findByPk(id_trabalho);
  if (!trabalhoOcorrencia) {
    return res.status(404).json({ error: "Trabalho nao encontrado" });
  }

  const user = await Utilizadores.findByPk(id_utilizador, {
    include: [{ model: InscricoesOcorrencia, where: { id_ocorrencia } }],
  });
  if (!user) {
    return res.status(404).json({ error: "Utilizador nao encontrado" });
  }

  if (user.InscricoesOcorrencia.length === 0) {
    return res
      .status(400)
      .json({ error: "Utilizador nao inscrito na ocorrência" });
  }

  const pdfFile = req.files["url_pdf"]?.[0];

  if (pdfFile) {
    const fileExtension = pdfFile.originalname.slice(-4).toLowerCase();
    if (fileExtension !== ".pdf") {
      return res.status(400).json({ error: "Arquivo inválido, deve ser .pdf" });
    }

    const uploadResponse = await cloudinary.uploader.upload(pdfFile.path, {
      resource_type: "raw",
      public_id: `docs/${path.parse(pdfFile.originalname).name}.pdf`,
      upload_preset: "pint",
    });

    const url_pdf = {
      secure_url: uploadResponse.secure_url,
      url: uploadResponse.url,
    };

    const trabalhoSubmetido = await SubmissoesTrabalhos.create({
      id_utilizador,
      id_trabalho,
      url_trabalho: url_pdf,
    });

    res.status(200).json({
      message:
        "Trabalho submetido com sucesso, aguarde a avaliação do professor",
      trabalhoSubmetido,
    });
  } else {
    return res
      .status(400)
      .json({ error: "Submeta o ficheiro do trabalho em pdf" });
  }
};

const atualizarTrabalhoSubmetido = async (req, res) => {
  const { id_submissao_trabalho } = req.params;

  const submissaoTrabalho = await SubmissoesTrabalhos.findByPk(
    id_submissao_trabalho
  );
  if (!submissaoTrabalho) {
    return res
      .status(404)
      .json({ error: "Submissao de trabalho nao encontrada" });
  }

  if (submissaoTrabalho.pontuacao) {
    return res
      .status(400)
      .json({
        error:
          "Esse trabalho ja foi avaliado, sendo assim nao pode ser alterado",
      });
  }

  const pdfFile = req.files["url_pdf"]?.[0];

  if (pdfFile) {
    const fileExtension = pdfFile.originalname.slice(-4).toLowerCase();

    if (fileExtension !== ".pdf") {
      return res.status(400).json({ error: "Arquivo inválido, deve ser .pdf" });
    }

    const uploadResponse = await cloudinary.uploader.upload(pdfFile.path, {
      resource_type: "raw",
      public_id: `docs/${path.parse(pdfFile.originalname).name}.pdf`,
      upload_preset: "pint",
    });

    const url_pdf = {
      secure_url: uploadResponse.secure_url,
      url: uploadResponse.url,
    };

    if (submissaoTrabalho.url_trabalho?.secure_url) {
      await destruirArquivoAnterior(submissaoTrabalho.url_trabalho.secure_url);
    }

    const trabalhoSubmetido = await submissaoTrabalho.update({
      url_trabalho: url_pdf,
    });

    res.status(200).json({
      message: "Trabalho submetido atualizado com sucesso",
      trabalhoSubmetido,
    });
  } else {
    return res
      .status(400)
      .json({ error: "Submeta o ficheiro do trabalho em pdf" });
  }
};

const apagarTrabalhoSubmetido = async (req, res) => {
  try {
    const { id_submissao_trabalho } = req.params;

    const submissaoTrabalho = await SubmissoesTrabalhos.findByPk(
      id_submissao_trabalho
    );
    if (!submissaoTrabalho) {
      return res
        .status(404)
        .json({ error: "Submissao de trabalho nao encontrada" });
    }

    if (submissaoTrabalho.pontuacao) {
      return res
        .status(400)
        .json({
          error:
            "Esse trabalho ja foi avaliado, sendo assim nao pode ser apagado",
        });
    }

    if (submissaoTrabalho.url_trabalho?.secure_url) {
      await destruirArquivoAnterior(submissaoTrabalho.url_trabalho.secure_url);
    }

    await submissaoTrabalho.destroy();

    res.status(200).json({
      message: "Trabalho apagado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao apagar submissao de trabalho:", error);
    res.status(500).json({ error: "Erro ao apagar submissao de trabalho" });
  }
};

const avaliarTrabalho = async (req, res) => {
  const { id_submissao_trabalho } = req.params;
  const { id_docente, nota, feedback } = req.body;

  const docente = await Utilizadores.findByPk(id_docente);
  if (!docente) {
    return res.status(404).json({ error: "Docente nao encontrado" });
  }

  if (docente.id_tipo_utilizador !== 2) {
    return res
      .status(403)
      .json({ error: "Apenas Formadores podem avaliar trabalhos" });
  }

  const submissaoTrabalho = await SubmissoesTrabalhos.findByPk(
    id_submissao_trabalho
  );
  if (!submissaoTrabalho) {
    return res
      .status(404)
      .json({ error: "Submissao de trabalho nao encontrada" });
  }

  const trabalhoOcorrencia = await TrabalhosOcorrencia.findByPk(
    submissaoTrabalho.id_trabalho
  );
  if (!trabalhoOcorrencia) {
    return res.status(404).json({ error: "Trabalho nao encontrado" });
  }

  const Ocorrencia = await OcorrenciasCurso.findByPk(
    trabalhoOcorrencia.id_ocorrencia
  );
  if (!Ocorrencia) {
    return res.status(404).json({ error: "Ocorrencia nao encontrada" });
  }

  if (Ocorrencia.id_utilizador !== id_docente) {
    return res
      .status(403)
      .json({
        error: "Apenas o docente dessa ocorrência pode avaliar os trabalhos",
      });
  }

  const trabalhoSubmetidoAvaliado = await submissaoTrabalho.update({
    pontuacao: nota,
    feedback,
  });

  const user = await Utilizadores.findByPk(submissaoTrabalho.id_utilizador);

  if (user) {
    notifyUser(
      user.email,
      `Olá ${user.nome}, O seu trabalho foi avaliado`,
      `Estamos a enviar esse email para informar que o seu trabalho foi avaliado`,
      `O seu trabalho foi avaliado com a nota de ${nota} ${feedback ? `e o docente deixou o seguinte feedback: ${feedback}` : ""}`
    );
  }

  res.status(200).json({
    message: "Trabalho avaliado com sucesso",
    trabalhoSubmetidoAvaliado,
  });
};

const adicionarConteudoOcorrencia = async (req, res) => {
 try {
  const { id_ocorrencia } = req.params;
  const { id_utilizador, titulo, conteudo } = req.body;

  const ocorrencia = await OcorrenciasCurso.findByPk(id_ocorrencia);
  if (!ocorrencia) {
    return res.status(404).json({ error: "Ocorrência nao encontrada" });
  }

  const user = await Utilizadores.findByPk(id_utilizador);
  if (!user) {
    return res.status(404).json({ error: "Utilizador nao encontrado" });
  }

  if (user.id_utilizador !== ocorrencia.id_utilizador) {
    return res
      .status(404)
      .json({
        error: "Apenas o docente dessa ocorrência pode adicionar conteudo",
      });
  }

  const pdfFile = req.files["url_pdf"]?.[0];
  let url_pdf = null;
  let conteudo_pdf = null;

  if (pdfFile) {
    const fileExtension = pdfFile.originalname.slice(-4).toLowerCase();
    if (fileExtension !== ".pdf") {
      return res.status(400).json({ error: "Arquivo inválido, deve ser .pdf" });
    }

    const uploadResponse = await cloudinary.uploader.upload(pdfFile.path, {
      resource_type: "raw",
      public_id: `docs/${path.parse(pdfFile.originalname).name}.pdf`,
      upload_preset: "pint",
    });

    url_pdf = uploadResponse.url;

    if (url_pdf) {
      conteudo_pdf = await Contudos.create({
        id_ocorrencia,
        titulo,
        conteudo: url_pdf,
        tipo_conteudo: "PDF",
        estado: 1,
      });
    }

  } else if (conteudo) {
    conteudo_pdf = await Contudos.create({
      id_ocorrencia,
      titulo,
      conteudo,
      tipo_conteudo: "Vídeo",
      estado: 1,
    });
  }

  const users = await InscricoesOcorrencia.findAll({
    where: { id_ocorrencia },
    include: [{ model: Utilizadores }],
  });

  res.json({
    message: "Conteudo adicionado com sucesso",
    conteudo_pdf,
  });

 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Erro ao adicionar conteudo a ocorrencia" });
 }
};

const atualizarConteudoOcorrencia = async (req, res) => {
  try {
    const { id_conteudo } = req.params;
    const { id_utilizador, titulo, conteudo, estado } = req.body;

    const conteudoOcorrencia = await Contudos.findByPk(id_conteudo);
    if (!conteudoOcorrencia) {
      return res.status(404).json({ error: "Conteúdo não encontrado" });
    }

    const ocorrencia = await OcorrenciasCurso.findByPk(conteudoOcorrencia.id_ocorrencia);
    if (!ocorrencia) {
      return res.status(404).json({ error: "Ocorrência não encontrada" });
    }

    const user = await Utilizadores.findByPk(id_utilizador);
    if (!user) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    if (user.id_utilizador !== ocorrencia.id_utilizador) {
      return res.status(403).json({ error: "Apenas o docente da ocorrência pode atualizar o conteúdo" });
    }



    // Se o conteúdo atual for PDF e o novo for um vídeo
    if (conteudoOcorrencia.tipo_conteudo === "PDF" && conteudo.slice(-4).toLowerCase() !== ".pdf") {
      await destruirArquivoAnterior(conteudoOcorrencia.conteudo);

      const conteudoAtualizado = await conteudoOcorrencia.update({
        titulo,
        conteudo,
        tipo_conteudo: "Vídeo",
        estado,
      });

      return res.json({ message: "Conteúdo atualizado com sucesso", conteudoAtualizado });
    }

    // Caso o novo conteúdo seja PDF (com upload)
    const pdf_file = req.files?.['url_pdf']?.[0];
    if (pdf_file) {
      await destruirArquivoAnterior(conteudoOcorrencia.conteudo);

      const uploadResponse = await cloudinary.uploader.upload(pdf_file.path, {
        resource_type: 'raw',
        public_id: `docs/${path.parse(pdf_file.originalname).name}`,
        upload_preset: 'pint',
      });

      const conteudoAtualizado = await conteudoOcorrencia.update({
        titulo,
        conteudo: uploadResponse.url,
        tipo_conteudo: "PDF",
        estado,
      });

      return res.json({ message: "Conteúdo atualizado com sucesso", conteudoAtualizado });
    }

    if (conteudoOcorrencia.tipo_conteudo === "Vídeo" && conteudo.includes("www.youtube.com/watch?")) {

      const conteudoAtualizado = await conteudoOcorrencia.update({
        titulo,
        conteudo,
        tipo_conteudo: "Vídeo",
        estado,
      });

      return res.json({ message: "Conteúdo atualizado com sucesso", conteudoAtualizado });
    }

    const conteudoAtualizado = await conteudoOcorrencia.update({ titulo, estado });

    return res.json({ message: "Conteúdo atualizado com sucesso", conteudoAtualizado });

  } catch (error) {
    console.error("Erro ao atualizar conteúdo da ocorrência:", error);
    return res.status(500).json({ error: "Erro ao atualizar conteúdo da ocorrência" });
  }
};

const deleteConteudoOcorrencia = async (req, res) => {
  try {
    const { id_conteudo } = req.params;

    const conteudoOcorrencia = await Contudos.findByPk(id_conteudo);
    if (!conteudoOcorrencia) {
      return res.status(404).json({ error: "Conteúdo não encontrado" });
    }

    if (conteudoOcorrencia.conteudo) {
      await destruirArquivoAnterior(conteudoOcorrencia.conteudo);
    }

    await conteudoOcorrencia.destroy();
    res.json({ message: "Conteúdo eliminado com sucesso" });
  } catch (error) {
    console.error("Erro ao eliminar conteúdo da ocorrência:", error);
    res.status(500).json({ error: "Erro ao eliminar conteúdo da ocorrência" });
  }
};

module.exports = {
  createOcorrencia,
  updateOcorrencia,
  deleteOcorrencia,
  submeterTrabalho,
  atualizarTrabalhoSubmetido,
  avaliarTrabalho,
  apagarTrabalhoSubmetido,
  adicionarConteudoOcorrencia,
  atualizarConteudoOcorrencia,
  deleteConteudoOcorrencia,
};
