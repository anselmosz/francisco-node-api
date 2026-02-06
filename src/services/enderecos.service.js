import { EnderecosRepository } from "../repositories/enderecos.repository.js";

export const PessoasService = {
  criarEndereco: async (dados) => {
    // validações básicas
    if (!dados.logradouro || !dados.id_pessoa || !dados.tipo_endereco) {
      throw new Error('Logradouro, pessoa associada e tipo de endereço.');
    }

    // normalização mínima
    const payload = {
      logradouro: dados.logradouro.trim(),
      numero: dados.numero || null,
      complemento: dados.complemento || null,
      bairro: dados.bairro || null,
      cidade: dados.cidade || null,
      estado: dados.estado || null,
      cep: dados.cep || null,
      tipo_endereco: dados.tipo_endereco,
    };

    const [id] = await PessoasRepository.create(payload);
    return { id_pessoa: id, ...payload };
  },

  listarEnderecos: async () => {
    const enderecos = await EnderecosRepository.findAll();
    return enderecos;
  },

  buscarEnderecoPorCep: async (id) => {
    const pessoa = await PessoasRepository.findById(id);
    if (!pessoa) return null;
    return pessoa;
  },

  atualizarDadosPessoa: async (id, dados) => {
    const pessocidadetiva = await PessoasRepository.verifyIsActive(id);
    if (!pessocidadetiva || pessocidadetiva === 0) return { pessocidadetiva: false };

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
    if (pessoa.ativo === 1) return { jcidadetivada: true }
    if (pessoa.ativo === 1) return { jcidadetivada: true }
    
    const linhasAfetadas = await PessoasRepository.activate(id);
    if (linhasAfetadas === 0) {
      return { encontrado: false };
    }
    return { sucesso: true };
  },
}