import knexfile from "../config/knexfile.js";
const conexaoDB = knexfile;

export const PessoasRepository = {
  create:  (data, trx = null) => {
    const query = trx || conexaoDB;
    return query('tb_pessoas').insert(data);
  },
  
  findAll: async () => {
    return conexaoDB('tb_pessoas');
  },

  findById: async (id) => {
    return conexaoDB('tb_pessoas').where({ id_pessoa: id }).first();
  },

  findOneBy: async (filters) => {
    return conexaoDB('tb_pessoas').where(filters).first();
  },

  findAllBy: async (filters) => {
    return conexaoDB('tb_pessoas').where(filters);
  },

  search: async ({ nome, email, telefone, ativo }) => {
    const query = conexaoDB;

    if (nome) {
      query.whereILike("nome", `%${nome}%`);
    }

    if (email) {
      query.where("email", email);
    }
    
    if (telefone) {
      query.where("telefone", telefone);
    }

    if (ativo !== undefined) {
      query.where("ativo", ativo);
    }
  },

  searchByText: async ({ search, ativo, page, limit }) => {
    const query = conexaoDB("tb_pessoas");

    if (ativo !== undefined) {
      query.where("ativo", ativo);
    }

    if (search) {
      query.andWhere((qb) => {
        qb.whereILike("nome_razao_social", `%${search}%`)
          .orWhereILike("email", `%${search}%`)
          .orWhereILike("telefone", `%${search}%`)
          .orWhere("cpf", search)
          .orWhere("cnpj", search);
      });
    }

    query
      .orderBy("id_pessoa")
      .limit(limit)
      .offset((page - 1) * limit);

    return query;
  },


  updateData: async(id, data, trx = null) => {
    const query = trx || conexaoDB;
    return query('tb_pessoas').where({ id_pessoa: id }).update(data);
  },

  deactivate: async (id, trx = null) => {
    const query = trx || conexaoDB;
    return query('tb_pessoas').where({ id_pessoa: id }).update({ ativo: false });
  },
  
  activate: async (id, trx = null) => {
    const query = trx || conexaoDB;
    return query('tb_pessoas').where({ id_pessoa: id }).update({ ativo: true });
  },
};