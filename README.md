# Sistema MVP

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz com a URL do banco de dados:

```
DATABASE_URL=postgres://usuario:senha@host:porta/banco
```

3. Popule o banco de dados:

```bash
npm run seed
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Credenciais iniciais

Após rodar o seed, é criado um usuário administrador padrão.

- **E-mail:** `admin@admin.com`
- **Senha:** `admin123`
