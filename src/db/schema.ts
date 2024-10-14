import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const camposPadroes = {
  dt_hr_inclusao: timestamp().defaultNow(),
  dt_hr_alteracao: timestamp().$onUpdate(() => new Date()),
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
  estoque_minimo: numeric({ precision: 10, scale: 2 }).default("0"),
  estoque_maximo: numeric({ precision: 10, scale: 2 }).default("0"),

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
  cep: varchar({ length: 15 }),
  endereco: varchar({ length: 127 }),
  bairro: varchar({ length: 127 }),
  numero: varchar({ length: 127 }),
  complemento: varchar({ length: 127 }),
  ponto_referencia: varchar({ length: 127 }),
  tipo_pessoa: tp_pessoa().array(),

  ...camposPadroes,
});

export const comprasTable = pgTable("compras", {
  id: serial().primaryKey(),
  data_emissao: timestamp().notNull(),
  data_entrada: timestamp().notNull(),
  valor_produto: numeric({ precision: 10, scale: 2 }).default("0"),
  valor_frete: numeric({ precision: 10, scale: 2 }).default("0"),
  valor_outros: numeric({ precision: 10, scale: 2 }).default("0"),
  valor_total: numeric({ precision: 10, scale: 2 }).default("0"),
  numero_documento: varchar({ length: 31 }),
  serie_documento: varchar({ length: 7 }),

  ...camposPadroes,

  pessoa_id: integer()
    .notNull()
    .references(() => pessoasTable.id, { onUpdate: "cascade" }),
});

export const comprasItensTable = pgTable("compras_itens", {
  id: integer().notNull().generatedAlwaysAsIdentity(),
  quantidade: numeric({ precision: 10, scale: 2 }).default("1"),
  valor_unitario: numeric({ precision: 10, scale: 2 }).default("0"),
  valor_total: numeric({ precision: 10, scale: 2 }).default("0"),
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
