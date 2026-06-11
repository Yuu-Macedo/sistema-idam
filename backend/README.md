# Backend Sistema IDAM

API RESTful do Sistema IDAM, desenvolvida com Django REST Framework.

## Stack

- Python 3.11+
- Django 5
- Django REST Framework
- SimpleJWT
- django-filter
- drf-spectacular
- django-cors-headers
- SQLite como fallback local
- PostgreSQL via `DATABASE_URL`

## Setup Local

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

URLs:

- API: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`
- Schema OpenAPI: `http://localhost:8000/api/schema/`
- Swagger: `http://localhost:8000/api/docs/`

## Docker

Na raiz do repositorio:

```bash
docker compose up --build
```

Servicos:

- `db`: PostgreSQL 16.
- `backend`: API Django na porta `8000`.

Comandos uteis:

```bash
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py test
docker compose down
docker compose down -v
```

## Variaveis De Ambiente

Copie o exemplo:

```bash
copy backend\.env.example backend\.env
```

Principais chaves:

```env
SECRET_KEY=change-me-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,backend
DATABASE_URL=postgres://idam_user:idam_password@db:5432/sistema_idam
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7
```

Sem `DATABASE_URL`, o projeto usa SQLite local.

## Autenticacao

```text
POST /api/auth/login/
POST /api/auth/refresh/
GET  /api/auth/me/
POST /api/auth/logout/
```

Use o token de acesso no header:

```text
Authorization: Bearer <access_token>
```

## Endpoints Principais

Produtores e relacionamentos:

```text
/api/produtores/
/api/produtores/{id}/culturas/
/api/produtores/{id}/registro/
/api/produtores/{id}/carteira/
/api/produtores/{id}/localizacao/
/api/produtores/{id}/paa/
/api/produtores/{id}/criacao-animal/
/api/produtores/{id}/meliponicultura/
```

Recursos gerais:

```text
/api/usuarios/
/api/culturas/
/api/registros/
/api/carteiras/
/api/localizacoes/
/api/criacoes-animais/
/api/avicultura/
/api/paa/
/api/especies-abelhas/
/api/meliponicultura/
/api/comunidades/
/api/veiculos/
/api/cronogramas/
/api/recomendacoes-tecnicas/
/api/atendimentos/
/api/documentos-emitidos/
/api/relatorios/dashboard/
```

## Testes

```bash
python manage.py test apps
python manage.py makemigrations --check --dry-run
```

No Windows, a partir da raiz:

```bash
backend\.venv\Scripts\python.exe backend\manage.py test apps
backend\.venv\Scripts\python.exe backend\manage.py makemigrations --check --dry-run
```

## Modelos E Migrations

Sempre que alterar modelos:

```bash
python manage.py makemigrations
python manage.py migrate
```

Antes de enviar mudancas, confira:

```bash
python manage.py makemigrations --check --dry-run
python manage.py test apps
```
