import { knexfile } from "../../infrastructure/database/knexfile";

const conexaoDB = knexfile;

export default {
  listarPessoas: async () => {
    const pessoas = await conexaoDB("tb_pessoas");
    return pessoas;
  },

  buscarPessoaPorID: async (id) => {
    const pessoa = await conexaoDB.select().from("tb_usuarios").where("id_pessoa", id);
    return pessoa;
  },
}