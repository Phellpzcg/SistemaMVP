# Sistema MVP

Projeto Node.js + Express utilizando PostgreSQL hospedado na Railway.

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz com a URL do banco de dados PostgreSQL fornecida pelo Railway:

```
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
```

3. Popule o banco de dados:

```bash
npm run seed
```

4. A tabela de sessões é criada automaticamente ao iniciar o servidor. O `connect-pg-simple` executa o arquivo `node_modules/connect-pg-simple/table.sql` para gerar a tabela caso ela não exista. Se preferir criar manualmente, rode:

```bash
psql mydatabase < node_modules/connect-pg-simple/table.sql
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Credenciais iniciais

Após rodar o seed, é criado um usuário administrador padrão.

- **E-mail:** `admin@demo.com`
- **Senha:** `Admin@123`
