import { PessoasService } from "../services/pessoas.service.js";

export const PessoasController = {
  criar: async (req, res) => {
    try {
      const result = await PessoasService.criarPessoa(req.body);
      return res.status(201).json({ result });
    }
    catch (err) {
      return res.status(400).json({ message: err.message })
    }
  },
  
  listar: async (req, res) => {
    const pessoas = await PessoasService.listarPessoas();
    return res.json(pessoas);
  },

  buscarPorID: async (req, res) => {
    const pessoa = await PessoasService.buscarPessoaPorID(req.params.id);
    if (!pessoa) {
      return res.status(404).json({ message: "Pessoa não econtrada" });
    }
    return res.status(200).json(pessoa);
  },

  buscar: async (req, res) => {
    const { search, ativo, page = 1, limit = 20 } = req.query;

    const resultado = await PessoasService.buscarPorTexto({
      search,
      ativo,
      page: Number(page),
      limit: Number(limit)
    });

    return res.status(200).json(resultado);
  },

  atualizar: async (req, res) => {
    const result = await PessoasService.atualizarDadosPessoa(req.params.id, req.body);
    if (!result.pessoaAtiva) {
      return res.status(423).json({ message: "Usuário inativo" })
    }
    if (!result.encontrado) {
      return res.status(404).json({ message: "Pessoa não encontrada" });
    }
    return res.status(200).json({message: "Atualizado com sucesso"});
  },

  desativar: async (req, res) => {
    const result = await PessoasService.desativarPessoa(req.params.id);
    
    if (result.jaDesativada) {
      return res.status(423).json({ message: "Pessoa já está desativada" });
    }
    if (result.encontrado === false) {
      return res.status(404).json({ message: "Pessoa não encontrada" });
    }
    return res.status(200).json({ message: "A pessoa foi desativada" });
  },

  ativar: async (req, res) => {
    const result = await PessoasService.ativarPessoa(req.params.id);
    
    if (result.jaAtivada) {
      return res.status(423).json({ message: "Pessoa já está ativada" });
    }
    if (result.encontrado === false) {
      return res.status(404).json({ message: "Pessoa não encontrada" });
    }
    return res.status(200).json({ message: "A pessoa foi ativada" });
  },
};