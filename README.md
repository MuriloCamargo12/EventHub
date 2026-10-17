# EventHub

O EventHub é uma versão enxuta de um site de eventos, no estilo Sympla. A pessoa encontra um evento, cria uma conta, reserva um lugar e o organizador acompanha quem vai.

A primeira versão cobre descoberta, conta, um tipo de ingresso com capacidade, reserva, cancelamento, histórico e presença. Ficaram de fora QR code, pagamento real, lotes de ingresso e doação. Doação entra depois, separada do ingresso.

## O que dá para fazer

**Visitante**

- Ver a lista de eventos.
- Filtrar por cidade, categoria e data.
- Abrir a página do evento, com vagas e o aviso de esgotado.

**Conta**

- Cadastrar. O cadastro cria o usuário e não inicia a sessão.
- Entrar e sair. A sessão dura 7 dias.
- Reservar um lugar, cancelar e ver o histórico.
- Sem sessão, reservar, criar, editar, ver participantes ou abrir "Minhas reservas" leva para a página de cadastro.

**Organizador**

- Criar e editar o próprio evento. A capacidade não pode ficar menor que as reservas ativas.
- Ver quem reservou e marcar presença.

Cada pessoa só tem uma reserva por evento. Cancelar não apaga a linha: o status vira `cancelled`, a vaga volta e uma nova reserva reaproveita a mesma linha.

## Decisões

**Sessão em cookie HttpOnly, não JWT no `localStorage`.**

A prova de login é um token aleatório (`randomBytes(32)`), guardado na tabela `sessions`. O navegador leva esse token no cookie `session`, com `httpOnly`, `sameSite: lax` e caminho `/`. O JavaScript da página não lê o token. O servidor confere a linha da sessão a cada rota protegida.

JWT resolveria a prova assinada, mas aqui o servidor precisa poder encerrar a sessão no logout e no vencimento. A tabela faz isso. O `localStorage` deixaria o token acessível a qualquer script da página.

**O cadastro não entra na aplicação.**

Criar a conta e iniciar a sessão são passos diferentes. Depois do `POST /users`, a pessoa entra em `POST /users/login`.

**E-mail desconhecido e senha errada devolvem a mesma resposta.**

O login não diz qual dos dois falhou. A senha fica com hash bcrypt e nunca volta na API.

**Quem organiza o evento sai da sessão, não do JSON.**

`organizerId` é gravado a partir do usuário autenticado. O corpo da criação e da edição não escolhe o dono do evento.

**A vaga é contada na API.**

Não existe coluna de "ingressos vendidos". A listagem conta reservas com status `reserved` e marca `soldOut` quando essa conta chega na capacidade. Duas reservas simultâneas no último lugar ainda podem passar juntas: a checagem não está numa transação.

**Cancelar é `PATCH`, não `DELETE`.**

O histórico precisa continuar mostrando a reserva cancelada, e o par `userId` + `eventId` é único. Atualizar o status preserva os dois.

## Como rodar

É preciso ter Node.js e MySQL.

No `backend`, crie um `.env`:

```env
DATABASE_HOST=localhost
DATABASE_USER=seu_usuario
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=eventhub
```

Suba o banco, instale as dependências e aplique as migrations:

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

A API sobe em `http://localhost:4000`.

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O site sobe em `http://localhost:3000`. O frontend chama a API em `http://localhost:4000`. Para apontar outro endereço, defina `API_URL` no ambiente do frontend.

O CORS da API aceita `http://localhost:3000` com credenciais, para o navegador guardar e reenviar o cookie.

## Estrutura

```text
backend/     NestJS, Prisma e MySQL
frontend/    Next.js
```

No backend, cada área (usuários, sessão, eventos, reservas) tem module, controller e service. O Prisma é a camada de dados. No frontend, `src/lib/api` tem uma função por rota, e as páginas chamam essas funções.
