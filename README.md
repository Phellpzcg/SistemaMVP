# Sistema MVP

Projeto Node.js + Express utilizando PostgreSQL hospedado na Railway.

## Configuração local

1. Defina `DATABASE_URL` do Railway em `.env` ou nas variáveis de ambiente.
2. Instale as dependências:

```bash
npm install
```

3. Popule o banco:

```bash
npm run seed
```

4. Inicie o servidor:

```bash
npm start
```

### Endpoints de teste

```text
GET /health    -> { ok: true }
GET /db-health -> { db: 'up' }
```

## CI/CD

Pull requests validam build, conexão e endpoints. Push na branch `main` faz deploy via Railway CLI.

## Credenciais iniciais

Após rodar o seed, é criado um usuário administrador padrão.

- **E-mail:** `admin@demo.com`
- **Senha:** `Admin@123`
