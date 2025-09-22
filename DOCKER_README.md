# Docker Deployment Guide for Property Management System

This guide provides instructions on how to build and run the Property Management System using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Building and Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/Rahuly1606/Property-management-System.git
   cd Property-management-System
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```

   This command will:
   - Build the backend and frontend images
   - Start the MySQL database
   - Start the backend Spring Boot application
   - Start the frontend Nginx server

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api

## Stopping the Application

To stop the application, run:
```bash
docker-compose down
```

To stop the application and remove all data (including the database volume):
```bash
docker-compose down -v
```

## Services

The application consists of the following services:

1. **MySQL Database** (mysql-db):
   - Port: 3307 (mapped to 3306 inside the container)
   - Data is persisted in a Docker volume

2. **Backend** (backend):
   - Spring Boot application
   - Port: 8080
   - Connects to the MySQL database

3. **Frontend** (frontend):
   - React application served by Nginx
   - Port: 80
   - Communicates with the backend through Nginx proxy

## Configuration

### Environment Variables

The following environment variables can be modified in the `docker-compose.yml` file:

- Database configuration:
  - `MYSQL_ROOT_PASSWORD`
  - `MYSQL_DATABASE`

- Backend configuration:
  - `SPRING_PROFILES_ACTIVE`
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`

## Troubleshooting

### Check Container Status

```bash
docker-compose ps
```

### View Container Logs

```bash
# View logs for all containers
docker-compose logs

# View logs for a specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql-db
```

### Access Container Shell

```bash
# Access backend container shell
docker exec -it pms-backend /bin/sh

# Access frontend container shell
docker exec -it pms-frontend /bin/sh

# Access database container shell
docker exec -it pms-mysql /bin/bash
```

### Database Connection Issues

If the backend cannot connect to the database, ensure:
1. The database container is running: `docker-compose ps`
2. The database has started properly: `docker-compose logs mysql-db`
3. The connection string in the backend configuration matches the database service name