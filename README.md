# Next.js Fullstack E-Commerce

A modern fullstack e-commerce application built with Next.js 16, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: [Prisma 7](https://www.prisma.io)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Authentication**: bcryptjs for password hashing
- **Containerization**: Docker & Docker Compose

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── generated/         # Generated Prisma client
│   └── ...
├── docker/                # Docker configuration
│   └── Dockerfile.local   # Local development Dockerfile
├── lib/                   # Shared utilities
│   └── prisma.ts         # Prisma client singleton
├── prisma/               # Database configuration
│   ├── migrations/       # Database migrations
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts          # Database seeding script
├── prisma.config.ts      # Prisma configuration
└── docker-compose.yml    # Docker Compose configuration
```

## Prerequisites

- Node.js 20 or higher
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (for local setup without Docker)

## Getting Started

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs-fullstack-ecommarce
   ```

2. **Start the application with Docker Compose**
   ```bash
   docker compose up
   ```

   This will:
   - Start a PostgreSQL database container
   - Build and start the Next.js application container
   - Automatically run database migrations
   - Seed the database with initial data
   - Start the development server on [http://localhost:3000](http://localhost:3000)

3. **Rebuild containers (if needed)**
   ```bash
   docker compose down
   docker compose build
   docker compose up
   ```

### Option 2: Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_db"
   ```

3. **Set up the database**
   ```bash
   # Run migrations
   npx prisma migrate dev
   
   # Seed the database
   npx prisma db seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database

### Schema

The application uses Prisma as the ORM. The database schema is defined in `prisma/schema.prisma`.

Current models:
- **User**: User authentication and profile data
  - `id`: Unique identifier (CUID)
  - `email`: Unique email address
  - `password`: Hashed password (bcrypt)

### Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Seeding

The database is automatically seeded when running `npm run dev` or when starting with Docker.

Default seed data:
- Admin user: `admin-system@gmail.com` / `Admin@123`

To manually run the seed:
```bash
npx prisma db seed
```

The seed script uses `upsert` operations, so it's safe to run multiple times.

## Development

### Available Scripts

- `npm run dev` - Start development server (includes auto-seeding)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Prisma Studio

To explore and manipulate your database with a GUI:
```bash
npx prisma studio
```

### Generate Prisma Client

After modifying the schema, regenerate the Prisma client:
```bash
npx prisma generate
```

## Docker Configuration

### Services

- **app** (nextjs-app): Next.js application
  - Port: 3000
  - Auto-reloads on file changes (volume mounted)
  
- **db** (postgres-db): PostgreSQL database
  - Port: 5432
  - Data persisted in Docker volume `postgres_data`

### Environment Variables (Docker)

The Docker setup uses the following environment variables (configured in `docker-compose.yml`):

```yaml
DATABASE_URL=postgresql://postgres:postgres@db:5432/ecommerce_db
```

## Troubleshooting

### Docker Issues

**Problem**: Module not found errors in Docker
```bash
# Rebuild the containers
docker compose down
docker compose build --no-cache
docker compose up
```

**Problem**: Database connection errors
```bash
# Check if the database is running
docker compose ps

# View database logs
docker compose logs db
```

### Local Development Issues

**Problem**: Prisma client errors
```bash
# Regenerate Prisma client
npx prisma generate
```

**Problem**: Migration errors
```bash
# Reset the database (⚠️ deletes all data)
npx prisma migrate reset
```

## Configuration Files

- `prisma.config.ts` - Prisma configuration (migrations, seeding)
- `docker-compose.yml` - Docker services configuration
- `docker/Dockerfile.local` - Docker image for local development
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com)

## License

This project is private and proprietary.
