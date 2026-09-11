-- CreateEnum
CREATE TYPE "PosicaoFila" AS ENUM ('PROXIMO', 'LISTA_ESPERA', 'CANCELADO');

-- CreateEnum
CREATE TYPE "Funcao" AS ENUM ('ADM', 'ALUNO');

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rm" INTEGER NOT NULL,
    "senha" TEXT NOT NULL,
    "funcao" "Funcao" NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livros" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "publicacao" TEXT NOT NULL,
    "editora" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,

    CONSTRAINT "Livros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emprestimos" (
    "id" SERIAL NOT NULL,
    "data_emprestimo" TIMESTAMP(3) NOT NULL,
    "data_devolucao" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "livroId" INTEGER NOT NULL,

    CONSTRAINT "Emprestimos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fila" (
    "id" SERIAL NOT NULL,
    "posicao" "PosicaoFila" NOT NULL DEFAULT 'LISTA_ESPERA',
    "usuarioId" INTEGER NOT NULL,
    "livroId" INTEGER NOT NULL,

    CONSTRAINT "Fila_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedbacks" (
    "id" SERIAL NOT NULL,
    "comentario" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "livroId" INTEGER NOT NULL,

    CONSTRAINT "Feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Noticias" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Noticias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sesi" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "unidade" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "cep" TEXT NOT NULL,

    CONSTRAINT "Sesi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_rm_key" ON "Usuarios"("rm");

-- AddForeignKey
ALTER TABLE "Emprestimos" ADD CONSTRAINT "Emprestimos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emprestimos" ADD CONSTRAINT "Emprestimos_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fila" ADD CONSTRAINT "Fila_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fila" ADD CONSTRAINT "Fila_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
