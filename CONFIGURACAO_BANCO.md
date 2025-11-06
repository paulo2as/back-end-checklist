# Configuração do Banco de Dados

## Erro de Conexão: `getaddrinfo ENOTFOUND base`

Este erro indica que a variável `DATABASE_URL` não está configurada corretamente no arquivo `.env`.

## Como Resolver

### 1. Crie um arquivo `.env` na raiz do projeto

```bash
touch .env
```

### 2. Configure a variável DATABASE_URL

Adicione a seguinte linha no arquivo `.env`:

#### Para banco local:
```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
```

#### Para banco remoto (Heroku, Railway, etc):
```env
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require
```

### 3. Substitua os valores:

- **usuario**: Seu usuário do PostgreSQL (ex: `postgres`)
- **senha**: Sua senha do PostgreSQL
- **localhost**: Host do banco (deixe `localhost` se for local)
- **5432**: Porta do PostgreSQL (padrão é 5432)
- **nome_do_banco**: Nome do seu banco de dados

### 4. Exemplo prático:

```env
DATABASE_URL=postgresql://postgres:minhasenha123@localhost:5432/api_inspecao
```

### 5. Certifique-se de que:

- O PostgreSQL está rodando
- O banco de dados foi criado
- As credenciais estão corretas
- O arquivo `.env` está na raiz do projeto (mesmo diretório do `server.js`)

### 6. Execute o script SQL para criar as tabelas:

```bash
psql -U seu_usuario -d seu_banco -f database.sql
```

Ou conecte-se ao banco e execute o conteúdo do arquivo `database.sql`.

## Formato da URL de Conexão

O formato completo é:
```
postgresql://[usuario[:senha]@][host][:porta][/database][?parametros]
```

## Problemas Comuns

### 1. Erro "ENOTFOUND base"
A URL está malformada ou incompleta. Verifique se a `DATABASE_URL` está configurada corretamente.

### 2. Erro "pg_hba.conf entry" (código 28000)
Este erro indica que o PostgreSQL está rejeitando a conexão por problemas de autenticação ou configuração.

**Soluções:**

#### Solução 1: Use 127.0.0.1 em vez de localhost
Isso força o uso de IPv4 e evita problemas com IPv6:
```env
DATABASE_URL=postgresql://usuario:senha@127.0.0.1:5432/nome_do_banco?sslmode=disable
```

#### Solução 2: Configure o pg_hba.conf
Edite o arquivo de configuração do PostgreSQL:
```bash
sudo nano /etc/postgresql/[versão]/main/pg_hba.conf
```

Adicione ou modifique a linha para permitir conexões locais:
```
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

Depois, reinicie o PostgreSQL:
```bash
sudo systemctl restart postgresql
```

#### Solução 3: Desabilite SSL para conexões locais
Se você está conectando localmente, adicione `?sslmode=disable`:
```env
DATABASE_URL=postgresql://usuario:senha@127.0.0.1:5432/database?sslmode=disable
```

### 3. Erro de autenticação
Verifique se o usuário e senha estão corretos. Teste a conexão manualmente:
```bash
psql -U usuario -d nome_do_banco -h 127.0.0.1
```

### 4. Erro de conexão (ECONNREFUSED)
O banco de dados não está rodando. Verifique o status:
```bash
sudo systemctl status postgresql
# ou
sudo service postgresql status
```

Inicie se necessário:
```bash
sudo systemctl start postgresql
```

### 5. Erro SSL
Para bancos remotos, adicione `?sslmode=require` na URL:
```env
DATABASE_URL=postgresql://usuario:senha@host:5432/database?sslmode=require
```

## Exemplos de Configuração

### Banco Local (PostgreSQL padrão)
```env
DATABASE_URL=postgresql://postgres:senha123@127.0.0.1:5432/api_inspecao?sslmode=disable
```

### Banco Remoto (com SSL)
```env
DATABASE_URL=postgresql://usuario:senha@host.exemplo.com:5432/database?sslmode=require
```

### Banco Heroku/Railway
```env
DATABASE_URL=postgresql://usuario:senha@host.provider.com:5432/database?sslmode=require
```

