# dashboard

## Prerequisites

- A GitHub OAuth app
  - Callback URL:
    - For production: `https://{YOUR_DOMAIN}/api/auth/callback/github`
    - For development: `http://localhost:3000/api/auth/callback/github`
- A Google OAuth app
  - Callback URL:
    - For production: `https://{YOUR_DOMAIN}/api/auth/callback/google`
    - For development: `http://localhost:3000/api/auth/callback/google`
- An AWS S3 bucket and an IAM user with access to it

## Run locally

### Setup .env

First, copy the sample environment file:

```
cp .env.sample .env
```

Then, edit `.env` and fill in the values for the following variables:

- `GITHUB_ID`: The client ID of your GitHub OAuth app
- `GITHUB_SECRET`: The client secret of your GitHub OAuth app
- `GOOGLE_ID`: The client ID of your Google OAuth app
- `GOOGLE_SECRET`: The client secret of your Google OAuth app
- `NEXTAUTH_SECRET`: A random string used to sign cookies (e.g. `openssl rand -base64 32`)
- `COLLABORATIVE_TOKEN_SECRET`: A random string used to sign the collaborative token (e.g. `openssl rand -base64 32`)
  - Set the same secret to the `.env` of the `collaborative-backend` package
- `AWS_S3_ACCESS_KEY_ID`: The access key ID of your AWS IAM user
- `AWS_S3_SECRET_ACCESS_KEY`: The secret access key of your AWS IAM user
- `AWS_S3_BUCKET_NAME`: The name of your AWS S3 bucket

### Start database

```
docker-compose up
```

### Install packages

```
pnpm install
```

### Migrate Prisma

```
pnpm prisma:migrate:dev
```

### Start other services (see the README of each package for how to set up)

```
cd ../collaborative-backend
pnpm dev
```

```
cd ../editor
pnpm dev
```

### Start development server

```
pnpm dev
```

## Deploy

### Prerequisites

- Deploy other services (`collaborative-backend` and `editor`) first

### Environment variables

- The same as the `.env` description for local development, plus
- `DATABASE_URL`: The URL of the MySQL database (we use PlanetScale, but you can use any MySQL-compatible database)
- `COLLABORATIVE_BACKEND_URL`: The WebSocket URL of the `collaborative-backend` service (eg. `wss://example.com`)
- `EDITOR_URL`: The URL of the `editor` service
  - The editor URL should support wildcard subdomains to use separate domains for each document for security reasons (since it can load arbitrary JavaScript code)
  - When you specify `https://example.com`, the editor should be available at any subdomains (e.g., `https://{documentID}.example.com`)
