# SHOP.CO Django API

Django 5.2 + Django REST Framework backend for the SHOP.CO storefront. This service is the catalog, order, and inventory source. The Next.js app stays on Vercel and talks to this API through `DJANGO_API_URL`.

## Local setup

Python 3.10+ (3.14 is supported on Django 5.2.8+).

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
# source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Health check: [http://127.0.0.1:8000/api/health/](http://127.0.0.1:8000/api/health/)  
Admin: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

Run the storefront in another terminal with `npm run dev`.

```bash
python manage.py test
```

## Environment

| Name | Required | Description |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | Yes when `DJANGO_DEBUG=False` | Django secret. Never commit a real value. |
| `DJANGO_DEBUG` | Production: `False` | Must be `False` in production. |
| `ALLOWED_HOSTS` | Yes in production | Comma-separated hosts, e.g. `api.example.com`. |
| `CORS_ALLOWED_ORIGINS` | Yes in production | Storefront origins only (local + Vercel). |
| `CSRF_TRUSTED_ORIGINS` | Yes for Admin on a public host | Include the Django origin with scheme. |
| `DATABASE_URL` | No locally | Defaults to SQLite. Use Postgres in production. |
| `CLOUDINARY_URL` or `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` | No | When set, product images go to Cloudinary. Otherwise files are stored under `backend/media/` and served at `/media/` while `DJANGO_DEBUG=True`. |

## Media storage

- **Cloudinary:** set the credentials above. Uploads use `django-cloudinary-storage`. API responses should expose the HTTPS Cloudinary URL.
- **Local disk:** used when Cloudinary is not configured. Fine for local development.
- **Ephemeral hosts:** Render, Railway, and Fly reset the filesystem. Local media **will be lost** on deploy/restart unless Cloudinary (or another persistent store) is configured.

## Production

Host this project on Render, Railway, or Fly. Set `DJANGO_DEBUG=False`, a unique `DJANGO_SECRET_KEY`, Postgres `DATABASE_URL`, `ALLOWED_HOSTS`, and CORS/CSRF origins for the Vercel storefront. Point Next.js at this service with `DJANGO_API_URL`.
