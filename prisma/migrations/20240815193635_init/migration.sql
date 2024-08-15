-- CreateTable
CREATE TABLE "products" (
    "rowid" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_alias" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "to_sell" BOOLEAN NOT NULL DEFAULT true,
    "to_buy" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "products_pkey" PRIMARY KEY ("rowid")
);

-- CreateTable
CREATE TABLE "thirdies" (
    "rowid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_alias" TEXT,
    "document" TEXT NOT NULL,
    "is_supplier" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "thirdies_pkey" PRIMARY KEY ("rowid")
);

-- CreateTable
CREATE TABLE "purchase_invoices" (
    "rowid" SERIAL NOT NULL,
    "fk_supplier_id" INTEGER NOT NULL,
    "entry_date" TIMESTAMP(3) NOT NULL,
    "issuance_date" TIMESTAMP(3) NOT NULL,
    "total_amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,

    CONSTRAINT "purchase_invoices_pkey" PRIMARY KEY ("rowid")
);

-- CreateTable
CREATE TABLE "purch_inv_det" (
    "rowid" SERIAL NOT NULL,
    "fk_purch_inv_id" INTEGER NOT NULL,
    "fk_product_id" INTEGER NOT NULL,
    "unitary" DECIMAL(65,30) NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "purch_inv_det_pkey" PRIMARY KEY ("rowid")
);

-- AddForeignKey
ALTER TABLE "purchase_invoices" ADD CONSTRAINT "purchase_invoices_fk_supplier_id_fkey" FOREIGN KEY ("fk_supplier_id") REFERENCES "thirdies"("rowid") ON DELETE RESTRICT ON UPDATE CASCADE;
