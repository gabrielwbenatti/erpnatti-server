import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const camposPadroes = {
  dt_hr_inclusao: timestamp().defaultNow(),
  dt_hr_alteracao: timestamp(),
};

export const tp_pessoa = pgEnum("tp_pessoa", [
  "CLIENTE",
  "FORNECEDOR",
  "FUNCIONARIO",
  "TRANSPORTADORA",
]);

export const grupoProdutosTable = pgTable("grupos_produtos", {
  id: serial().primaryKey(),
  nome: varchar({ length: 127 }).notNull(),
  status: boolean().default(true),

  ...camposPadroes,
});

export const linhaProdutosTable = pgTable("grupos_produtos", {
  id: serial().primaryKey(),
  nome: varchar({ length: 127 }).notNull(),
  status: boolean().default(true),

  ...camposPadroes,
});

export const produtosTable = pgTable("produtos", {
  id: serial().primaryKey(),
  nome: varchar({ length: 127 }).notNull(),
  codigo_barra: varchar({ length: 127 }),
  referencia: varchar({ length: 63 }),
  movimenta_estoque: boolean().default(true),
  status: boolean().default(true),
  estoque_minimo: real().default(0),
  estoque_maximo: real().default(0),

  ...camposPadroes,

  grupo_produto_id: integer().references(() => grupoProdutosTable.id, {
    onUpdate: "cascade",
  }),
  linha_produto_id: integer().references(() => linhaProdutosTable.id, {
    onUpdate: "cascade",
  }),
});

export const pessoasTable = pgTable("pessoas", {
  id: serial().primaryKey(),
  razao_social: varchar({ length: 127 }).notNull(),
  nome_fantasia: varchar({ length: 127 }),
  cpf_cnpj: varchar({ length: 31 }),
  tipo_pessoa: varchar({ length: 31 }).array().default([]),

  cep: varchar({ length: 15 }),
  endereco: varchar({ length: 127 }),
  cidade: varchar({ length: 127 }),
  bairro: varchar({ length: 127 }),
  numero: varchar({ length: 127 }),
  complemento: varchar({ length: 127 }),
  codigo_ibge: integer(),
  ponto_referencia: varchar({ length: 127 }),

  ...camposPadroes,
});

export const comprasTable = pgTable("compras", {
  id: serial().primaryKey(),
  data_emissao: date({ mode: "date" }).notNull(),
  data_entrada: date({ mode: "date" }).notNull(),
  valor_produto: real().default(0),
  valor_frete: real().default(0),
  valor_outros: real().default(0),
  valor_total: real().default(0),
  numero_documento: varchar({ length: 31 }),
  serie_documento: varchar({ length: 7 }),

  ...camposPadroes,

  pessoa_id: integer()
    .notNull()
    .references(() => pessoasTable.id, { onUpdate: "cascade" }),
});

export const comprasItensTable = pgTable("compras_itens", {
  id: integer().notNull().generatedAlwaysAsIdentity(),
  // descricao: varchar({ length: 127 }).notNull(),
  quantidade: real().default(0),
  valor_unitario: real().default(0),
  valor_total: real().default(0),
  observacao: varchar({ length: 127 }),

  ...camposPadroes,

  compra_id: integer()
    .notNull()
    .references(() => comprasTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  produto_id: integer()
    .notNull()
    .references(() => produtosTable.id, { onUpdate: "cascade" }),
});

export const contasPagarTable = pgTable("contas_pagar", {
  id: serial().primaryKey(),
  numero_titulo: varchar().notNull(),
  valor: real().default(0),
  data_vencimento: date({ mode: "date" }).notNull(),
  data_emissao: date({ mode: "date" }),
  numero_parcela: smallint().default(1),

  compra_id: integer().references(() => comprasTable.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  pessoa_id: integer()
    .notNull()
    .references(() => pessoasTable.id, { onUpdate: "cascade" }),
});

export const contasPagamentosTable = pgTable("contas_pagamentos", {
  id: serial().primaryKey(),
  data: date({ mode: "date" }).notNull(),
  valor: real().default(0),

  conta_pagar_id: integer()
    .notNull()
    .references(() => contasPagarTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

// export const viewComprasItens = pgView("v_compras_itens").as((qb) =>
//   qb
//     .select({
//       id: comprasItensTable.id,
//       produto_id: comprasItensTable.produto_id,
//       compra_id: comprasItensTable.compra_id,
//       nome: produtosTable.nome,
//       quantidade: comprasItensTable.quantidade,
//       valor_unitario: comprasItensTable.valor_unitario,
//       valor_total: comprasItensTable.valor_total,
//       observacao: comprasItensTable.observacao,
//     })
//     .from(comprasItensTable)
//     .innerJoin(
//       produtosTable,
//       eq(produtosTable.id, comprasItensTable.produto_id)
//     )
// );
