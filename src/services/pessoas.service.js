import { PessoasRepository } from "../repositories/pessoas.repository.js";

export const PessoasService = {
  criarPessoa: async (dados) => {
    // validações básicas
    if (!dados.nome_razao_social || !dados.tipo_pessoa) {
      throw new Error('Nome/Razão social e tipo da pessoa são obrigatórios.');
    }

    // validação de CPF/CNPJ conforme tipo de pessoa
    if (dados.tipo_pessoa === 'FISICA' && !dados.cpf) {
      throw new Error('CPF obrigatório para pessoa física.');
    }
    if (dados.tipo_pessoa === 'JURIDICA' && !dados.cnpj) {
      throw new Error('CNPJ obrigatório para pessoa jurídica.');
    }

    // normalização mínima
    const payload = {
      nome_razao_social: dados.nome_razao_social.trim(),
      tipo_pessoa: dados.tipo_pessoa,
      cpf: dados.cpf || null,
      cnpj: dados.cnpj || null,
      telefone: dados.telefone || null,
      email: dados.email || null,
      ativo: true
    };

    const [id] = await PessoasRepository.create(payload);
    return { id_pessoa: id, ...payload };
  },

  listarPessoas: async () => {
    const pessoas = await PessoasRepository.findAll();
    return pessoas;
  },

  buscarPessoaPorID: async (id) => {
    const pessoa = await PessoasRepository.findById(id);
    if (!pessoa) return null;
    return pessoa;
  },

  buscarPorTexto: async ({ search, ativo, page, limit }) => {
    const filtros = {
      search,
      ativo: ativo !== undefined ? ativo === "true" : true,
      page,
      limit
    };

    return PessoasRepository.searchByText(filtros);
  },

  atualizarDadosPessoa: async (id, dados) => {
    const pessoaAtiva = await PessoasRepository.verifyIsActive(id);
    if (!pessoaAtiva || pessoaAtiva === 0) return { pessoaAtiva: false };

    const linhasAfetadas = await PessoasRepository.updateData(id, dados);
    if (linhasAfetadas === 0) {
      return { encontrado: false };
    }
    return { sucesso: true };
  },

  desativarPessoa: async (id) => {
    const pessoa = await PessoasRepository.verifyIsActive(id);
    if (!pessoa) return { encontrado: false };
    if (pessoa.ativo === 0) return { jaDesativada: true }

    const linhasAfetadas = await PessoasRepository.deactivate(id);
    if (linhasAfetadas === 0) {
      return { encontrado: false };
    }
    return { sucesso: true };
  },

  ativarPessoa: async (id) => {
    const pessoa = await PessoasRepository.verifyIsActive(id);
    if (!pessoa) return { encontrado: false };
    if (pessoa.ativo === 1) return { jaAtivada: true }
    
    const linhasAfetadas = await PessoasRepository.activate(id);
    if (linhasAfetadas === 0) {
      return { encontrado: false };
    }
    return { sucesso: true };
  },
}