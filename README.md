# udemy-microsrv-auth

Microservice for managing authentication

## Getting Started

### Environment Variables

Copy `.env.example` to `.env` and define the required environment variables.

### Running Locally

Install dependencies and start the application:

```bash
npm install
npx prisma generate
npm run start:dev
```

### Running in a Development Container

Build and run the development container using the provided `Dockerfile`:

```bash
docker build -t udemy-microsrv-auth-dev -f Dockerfile .
docker run --env-file .env udemy-microsrv-auth-dev
```

### Running in a Production Container

Build and run the production container using `Dockerfile.prod`:

```bash
docker build -t udemy-microsrv-auth-prod -f Dockerfile.prod .
docker run --env-file .env udemy-microsrv-auth-prod
```

### Migrations

Run database migrations using Prisma:

- For local development:
  ```bash
  npx prisma migrate dev
  ```
- For production:
  ```bash
  npx prisma migrate deploy
  ```
