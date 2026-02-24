# Gabarito Escolar - Guia de Instalação

Este projeto já está configurado para rodar no GitHub Pages. Siga os passos abaixo.

## 1. Preparar os Arquivos
Baixe todos os arquivos deste projeto para o seu computador.

## 2. Criar Repositório no GitHub
1. Acesse [github.com/new](https://github.com/new).
2. Crie um novo repositório (ex: `gabarito-escolar`).
3. Deixe como **Public** (Público).
4. Clique em **Create repository**.

## 3. Enviar os Arquivos
1. Na página do seu novo repositório, clique em **"uploading an existing file"** (ou arraste os arquivos).
2. Arraste **TODOS** os arquivos e pastas que você baixou.
3. Aguarde o upload e clique em **Commit changes**.

## 4. Configurar o GitHub Pages
1. No seu repositório, vá em **Settings** (Configurações) > **Pages** (menu lateral esquerdo).
2. Em **Source**, selecione **GitHub Actions**.
3. O GitHub irá detectar automaticamente o arquivo de configuração que criei (`.github/workflows/deploy.yml`) e começará o processo.

## 5. Acessar o Site
1. Vá na aba **Actions** do seu repositório.
2. Você verá um fluxo chamado "Deploy to GitHub Pages" rodando (bolinha amarela ou verde).
3. Quando ficar **Verde**, clique nele e procure o link do seu site em **deploy** (ou volte em Settings > Pages para ver o link).

---

## ⚠️ Importante sobre a Planilha

O sistema usa o **ID da Planilha** para buscar os dados.
Atualmente está configurado com o ID: `14PkGTt0fy5FWd4QeH-DkJCJqdfqJn9r0GDcecAHyqYc`

Se você criou uma **NOVA** planilha (cópia), você precisa:
1. Abrir o arquivo `src/services/sheetService.ts`.
2. Trocar o `SHEET_ID` pelo ID da sua nova planilha.
   * O ID fica na URL de edição: `docs.google.com/spreadsheets/d/ESTE_E_O_ID/edit`
3. Certifique-se que a planilha está publicada (**Arquivo > Compartilhar > Publicar na Web**).
