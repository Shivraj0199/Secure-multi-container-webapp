# Secure multi-container webapp using docker-compose and Nginx reverse proxy

**"I built a production-like Docker setup with four containers: frontend, backend, database, and an Nginx reverse proxy. The reverse proxy routes requests — static website traffic goes to the frontend, while API requests go to the backend.
I used Docker secrets to manage sensitive database credentials, and volumes to persist MongoDB data. This setup ensures services are isolated, secure, and easy to deploy with Docker Compose."**

**"In this entire project i uses Nginx instead of traefik because Nginx is simpler and widely used in production environments, making it easier to explain and configure manually. Traefik is great for dynamic environments, but for this project, I wanted to show clear control over routing."**

## Architecture :

* Frontend (Nginx) → Serves the static website
* Backend (Node.js) → REST API
* Database (MongoDB) → Data persistence
* Reverse Proxy (Nginx) → Routes traffic between frontend and backend

### Step 1: Make sure you have installed all the dependencies (Install Docker & Docker-compose)

1. sudo su
2. sudo yum install docker.io
3. curl -SL https://github.com/docker/compose/releases/download/v2.30.3/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
4. chmod +x /usr/local/bin/docker-compose
5. docker-compose -v

### Step 2: Create Project Folder Structure

1. mkdir multi-container
2. cd multi-container
3. mkdir frontend, backend, nginx, secrets (inside the root folder multi-container)
4. creates a docker-compose.yml file (inside the root folder multi-container)

### Step 3: 
