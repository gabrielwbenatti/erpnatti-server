import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const tp_pessoa = pgEnum("tp_pessoa", [
  "CLIENTE",
  "FORNECEDOR",
  "FUNCIONARIO",
  "TRANSPORTADORA",
]);

export const grupoProdutosTabela = pgTable("grupos_produtos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar({ length: 127 }).notNull(),
  status: boolean().default(true),
});

export const linhaProdutosTabela = pgTable("grupos_produtos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar({ length: 127 }).notNull(),
  status: boolean().default(true),
});

export const produtosTabela = pgTable("produtos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar({ length: 127 }).notNull(),
  codigo_barra: varchar({ length: 127 }),
  referencia: varchar({ length: 63 }),
  movimenta_estoque: boolean().default(true),
  status: boolean().default(true),
  estoque_minimo: numeric({ precision: 100, scale: 2 }).default("0"),
  estoque_maximo: numeric({ precision: 100, scale: 2 }).default("0"),

  grupo_produto_id: integer().references(() => grupoProdutosTabela.id),
  linha_produto_id: integer().references(() => linhaProdutosTabela.id),
});

export const pessoasTable = pgTable("pessoas", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  razao_social: varchar({ length: 127 }).notNull(),
  nome_fantasia: varchar({ length: 127 }),
  cpf_cnpj: varchar({ length: 31 }),
  cep: varchar({ length: 15 }),
  endereco: varchar({ length: 127 }),
  bairro: varchar({ length: 127 }),
  numero: varchar({ length: 127 }),
  complemento: varchar({ length: 127 }),
  ponto_referencia: varchar({ length: 127 }),
  tipo_pessoa: tp_pessoa().array(),
});

export const comprasTable = pgTable("compras", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  pessoa_id: integer().notNull(),
  data_emissao: timestamp().notNull(),
  data_entrada: timestamp().notNull(),
  valor_produto: numeric({ precision: 100, scale: 2 }).default("0"),
  valor_frete: numeric({ precision: 100, scale: 2 }).default("0"),
  valor_outros: numeric({ precision: 100, scale: 2 }).default("0"),
  valor_total: numeric({ precision: 100, scale: 2 }).default("0"),
  numero_documento: varchar({ length: 31 }),
  serie_documento: varchar({ length: 7 }),
});
