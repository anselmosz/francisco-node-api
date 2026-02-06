import knexfile from "../config/knexfile.js";
const conexaoDB = knexfile;

export const EnderecosRepository = {
  create:  (data, trx = null) => {
    const query = trx || conexaoDB;
    return query('tb_enderecos').insert(data);
  },
  
  findAll: async () => {
    return conexaoDB('tb_enderecos');
  },

  findById: async (id) => {
    return conexaoDB('tb_enderecos').where({ id_endereco: id }).first();
  },

  updateData: async(id, data, trx = null) => {
    const query = trx || conexaoDB;
    return query('tb_enderecos').where({ id_endereco: id }).update(data);
  },

  delete: async (id, trx = null) => {
    const query = trx || conexaoDB;
    return query('tb_enderecos').where({ id_endereco: id }).del();
  },
};