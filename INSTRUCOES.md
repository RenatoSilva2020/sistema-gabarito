# Instruções para Publicar no GitHub Pages

Agora o projeto está corrigido e pronto para ser enviado. Siga estes passos com atenção.

## 1. Baixar os Arquivos
1. Baixe todos os arquivos deste projeto para o seu computador.
2. Extraia (se estiver zipado) para uma pasta.

## 2. Criar o Repositório no GitHub
1. Acesse [github.com/new](https://github.com/new).
2. Dê um nome para o repositório (ex: `gabarito-escolar`).
3. Deixe como **Public** (Público).
4. Clique em **Create repository**.

## 3. Enviar os Arquivos
1. Na tela do repositório criado, clique no link **"uploading an existing file"** (ou vá em *Add file > Upload files*).
2. Arraste **TODOS** os arquivos e pastas do seu computador para a área de upload.
   * **Importante:** Certifique-se de incluir a pasta oculta `.github` se ela aparecer. Se não conseguir ver ou arrastar pastas ocultas, não tem problema, o GitHub vai usar a configuração padrão ou você pode criar manualmente depois.
   * Mas o mais importante é o `package.json`, `vite.config.ts`, `index.html` e a pasta `src`.
3. Aguarde o upload terminar.
4. No campo "Commit changes", escreva "Versão inicial".
5. Clique no botão verde **Commit changes**.

## 4. Configurar o GitHub Pages (O Passo Decisivo)
1. No seu repositório, clique na aba **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
   * **NÃO** selecione "Deploy from a branch" ou "Static HTML".
4. Ao selecionar "GitHub Actions", o GitHub pode sugerir alguns fluxos.
   * Se você enviou a pasta `.github/workflows/deploy.yml` corretamente, ele vai detectar automaticamente.
   * Se não detectar, procure por **"Static HTML"** na lista, clique em **Configure**, e cole o código abaixo (substituindo tudo):

```yaml
name: Deploy React App

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 5. Acompanhar e Acessar
1. Clique na aba **Actions** do repositório.
2. Você verá o processo rodando. Se der erro, clique para ver os detalhes (agora deve funcionar pois corrigimos as dependências).
3. Quando ficar **Verde**, o link do seu site estará disponível em **Settings > Pages** ou clicando no job de deploy na aba Actions.

---

### Observação sobre a Planilha
O sistema continua usando o ID da planilha configurado (`14PkGTt0fy5FWd4QeH-DkJCJqdfqJn9r0GDcecAHyqYc`). Se precisar mudar, edite o arquivo `src/services/sheetService.ts` direto no GitHub (clicando no lápis) e faça o Commit. O site será atualizado automaticamente.
