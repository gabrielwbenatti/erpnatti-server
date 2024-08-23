-- CreateEnum
CREATE TYPE "TIPO_PESSOA" AS ENUM ('CLI', 'FORN', 'TRANSP', 'FUNC');

-- CreateTable
CREATE TABLE "grupos_produtos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(127) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "grupos_produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(127) NOT NULL,
    "codigo_barra" VARCHAR(127) NOT NULL DEFAULT '',
    "movimenta_estoque" BOOLEAN NOT NULL DEFAULT true,
    "estoque_minimo" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "estoque_maximo" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "grupo_produto_id" INTEGER,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoas" (
    "id" SERIAL NOT NULL,
    "razao_social" VARCHAR(127) NOT NULL,
    "nome_fantasia" VARCHAR(127),
    "cpf_cnpj" VARCHAR(31) NOT NULL,
    "tipo_pessoa" "TIPO_PESSOA" NOT NULL DEFAULT 'CLI',
    "usuario_id" INTEGER,

    CONSTRAINT "pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome_usuario" VARCHAR(63) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compras" (
    "id" SERIAL NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "data_emissao" TIMESTAMP(3) NOT NULL,
    "data_entrada" TIMESTAMP(3) NOT NULL,
    "valor_produto" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "valor_outros" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "valor_total" DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compras_itens" (
    "id" SERIAL NOT NULL,
    "compra_id" INTEGER NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "valor_unitario" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "valor_total" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "observacao" TEXT NOT NULL,

    CONSTRAINT "compras_itens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_grupo_produto_id_fkey" FOREIGN KEY ("grupo_produto_id") REFERENCES "grupos_produtos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas" ADD CONSTRAINT "pessoas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras_itens" ADD CONSTRAINT "compras_itens_compra_id_fkey" FOREIGN KEY ("compra_id") REFERENCES "compras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras_itens" ADD CONSTRAINT "compras_itens_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
