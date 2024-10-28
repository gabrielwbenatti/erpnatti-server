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

// const order_status = pgEnum("order_status", ["DRAFT", "VALIDATED", "FINISHED"]);

const defaultFields = {
  included_at: timestamp().defaultNow(),
  modified_at: timestamp(),
};

export const productGroup = pgTable("products_groups", {
  id: serial().primaryKey(),
  name: varchar({ length: 127 }).notNull(),
  status: boolean().default(true),

  ...defaultFields,
});

export const productLine = pgTable("products_lines", {
  id: serial().primaryKey(),
  name: varchar({ length: 127 }).notNull(),
  status: boolean().default(true),

  ...defaultFields,
});

export const product = pgTable("products", {
  id: serial().primaryKey(),
  name: varchar({ length: 127 }).notNull(),
  barcode: varchar({ length: 127 }),
  reference: varchar({ length: 63 }),
  move_stock: boolean().default(true),
  status: boolean().default(true),
  minimum_stock: real().default(0),
  maximum_stock: real().default(0),
  current_stock: real().default(0),

  ...defaultFields,

  product_group_id: integer().references(() => productGroup.id, {
    onUpdate: "cascade",
  }),
  product_line_id: integer().references(() => productLine.id, {
    onUpdate: "cascade",
  }),
});

export const stockMovement = pgTable("stock_movements", {
  id: serial().primaryKey(),
  date: date({ mode: "date" }).default(new Date()),
  quantity: real().default(0),
  observation: varchar({ length: 255 }),
  product_id: integer()
    .notNull()
    .references(() => product.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const person = pgTable("people", {
  id: serial().primaryKey(),
  company_name: varchar({ length: 127 }).notNull(),
  trading_name: varchar({ length: 127 }),
  cpf_cnpj: varchar({ length: 31 }),
  contact_type: varchar({ length: 31 }).array().default([]),
  status: boolean().default(true),

  zip_code: varchar({ length: 15 }),
  address: varchar({ length: 127 }),
  city: varchar({ length: 127 }),
  neighbourhood: varchar({ length: 127 }),
  number: varchar({ length: 127 }),
  complement: varchar({ length: 127 }),
  ibge_code: integer(),
  reference_point: varchar({ length: 127 }),
  email: varchar({ length: 255 }),

  ...defaultFields,
});

export const purchase = pgTable("purchases", {
  id: serial().primaryKey(),
  emission_date: date({ mode: "date" }).notNull(),
  entry_date: date({ mode: "date" }).notNull(),
  product_amount: real().default(0),
  delivery_amount: real().default(0),
  others_amount: real().default(0),
  total_amount: real().default(0),
  document_number: varchar({ length: 31 }),
  document_series: varchar({ length: 7 }),
  // status: order_status().default("DRAFT"),

  ...defaultFields,

  person_id: integer()
    .notNull()
    .references(() => person.id, { onUpdate: "cascade" }),
});

export const purchaseItem = pgTable("purchases_items", {
  id: integer().notNull().generatedAlwaysAsIdentity(),
  // descricao: varchar({ length: 127 }).notNull(),
  quantity: real().default(0),
  unitary_amount: real().default(0),
  total_amount: real().default(0),
  observation: varchar({ length: 127 }),

  ...defaultFields,

  purchase_id: integer()
    .notNull()
    .references(() => purchase.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  product_id: integer()
    .notNull()
    .references(() => product.id, { onUpdate: "cascade" }),
});

export const payable = pgTable("payables", {
  id: serial().primaryKey(),
  title_number: varchar().notNull(),
  amount: real().default(0),
  due_date: date({ mode: "date" }).notNull(),
  emission_date: date({ mode: "date" }),
  parcel_number: smallint().default(1),

  ...defaultFields,

  purchase_id: integer().references(() => purchase.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  person_id: integer()
    .notNull()
    .references(() => person.id, { onUpdate: "cascade" }),
});

export const payments = pgTable("payments", {
  id: serial().primaryKey(),
  date: date({ mode: "date" }).notNull(),
  value: real().default(0),

  ...defaultFields,

  payable_id: integer()
    .notNull()
    .references(() => payable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const sale = pgTable("sales", {
  id: serial().primaryKey(),
  emission_date: date({ mode: "date" }).notNull(),
  entry_date: date({ mode: "date" }).notNull(),
  product_amount: real().default(0),
  delivery_amount: real().default(0),
  others_amount: real().default(0),
  total_amount: real().default(0),
  document_number: varchar({ length: 31 }),
  document_series: varchar({ length: 7 }),

  ...defaultFields,

  person_id: integer()
    .notNull()
    .references(() => person.id, { onUpdate: "cascade" }),
});

export const saleItem = pgTable("sales_items", {
  id: integer().notNull().generatedAlwaysAsIdentity(),
  // descricao: varchar({ length: 127 }).notNull(),
  quantity: real().default(0),
  unitary_amount: real().default(0),
  total_amount: real().default(0),
  observation: varchar({ length: 127 }),

  ...defaultFields,

  sale_id: integer()
    .notNull()
    .references(() => sale.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  product_id: integer()
    .notNull()
    .references(() => product.id, { onUpdate: "cascade" }),
});

export const receivable = pgTable("receivables", {
  id: serial().primaryKey(),
  title_number: varchar().notNull(),
  amount: real().default(0),
  due_date: date({ mode: "date" }).notNull(),
  emission_date: date({ mode: "date" }),
  parcel_number: smallint().default(1),

  ...defaultFields,

  person_id: integer()
    .notNull()
    .references(() => person.id, { onUpdate: "cascade" }),
});

export const receipt = pgTable("receipts", {
  id: serial().primaryKey(),
  date: date({ mode: "date" }).notNull(),
  value: real().default(0),

  ...defaultFields,

  receivable_id: integer()
    .notNull()
    .references(() => receivable.id, {
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
