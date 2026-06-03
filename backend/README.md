# Backend Sistema IDAM

API RESTful em Django REST Framework para o Sistema IDAM.

## Stack

- Python 3.11+
- Django 5
- Django REST Framework
- SimpleJWT
- PostgreSQL via `DATABASE_URL`
- CORS para React/Vite
- django-filter
- drf-spectacular
- Docker e Docker Compose

## Rodar Com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

A API ficará disponível em:

```text
http://localhost:8000/api/
```

O Swagger ficará em:

```text
http://localhost:8000/api/docs/
```

O Compose cria:

- `db`: PostgreSQL 16
- `backend`: Django/DRF na porta `8000`

As migrations rodam automaticamente quando o container do backend sobe.

O `docker-compose.yml` já define variáveis de desenvolvimento. Para customizar valores locais, copie:

```bash
copy backend\.env.example backend\.env
```

Para criar superusuário com Docker:

```bash
docker compose exec backend python manage.py createsuperuser
```

Para rodar testes com Docker:

```bash
docker compose exec backend python manage.py test
```

Para parar:

```bash
docker compose down
```

Para apagar também o volume do PostgreSQL:

```bash
docker compose down -v
```

## Rodar Sem Docker

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
copy .env.example .env
```

Edite `.env` e ajuste `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL` e `CORS_ALLOWED_ORIGINS`.

Para desenvolvimento local sem PostgreSQL configurado, o projeto usa SQLite como fallback quando `DATABASE_URL` não estiver definido. Para produção, use PostgreSQL em `DATABASE_URL`.

## Banco De Dados

```bash
python manage.py migrate
python manage.py createsuperuser
```

## Rodar API Local

```bash
python manage.py runserver
```

API local:

```text
http://localhost:8000/api/
```

## Documentação

```text
http://localhost:8000/api/schema/
http://localhost:8000/api/docs/
```

## Autenticação

```text
POST /api/auth/login/
POST /api/auth/refresh/
GET  /api/auth/me/
POST /api/auth/logout/
```

Use o token `access` como:

```text
Authorization: Bearer <access_token>
```

## Endpoints Principais

```text
/api/produtores/
/api/produtores/{id}/culturas/
/api/produtores/{id}/registro/
/api/produtores/{id}/carteira/
/api/produtores/{id}/localizacao/
/api/produtores/{id}/paa/
/api/produtores/{id}/criacao-animal/
/api/produtores/{id}/meliponicultura/

/api/culturas/
/api/registros/
/api/carteiras/
/api/localizacoes/
/api/criacoes-animais/
/api/avicultura/
/api/especies-abelhas/
/api/meliponicultura/
/api/relatorios/dashboard/

/api/comunidades/
/api/veiculos/
/api/cronogramas/
/api/recomendacoes-tecnicas/
/api/atendimentos/
/api/documentos-emitidos/
```

## Testes

```bash
python manage.py test
```

## Integração Com Frontend

O CORS já permite:

```text
http://localhost:5173
http://127.0.0.1:5173
```

No frontend, configure a URL base da API como:

```text
http://localhost:8000/api
```

Em projetos Vite, use:

```text
VITE_API_URL=http://localhost:8000/api
```
