# Secure multi-container webapp using docker-compose and Nginx reverse proxy

**"I built a production-like Docker setup with four containers: frontend, backend, database, and an Nginx reverse proxy. The reverse proxy routes requests — static website traffic goes to the frontend, while API requests go to the backend.
I used Docker secrets to manage sensitive database credentials, and volumes to persist MongoDB data. This setup ensures services are isolated, secure, and easy to deploy with Docker Compose."**

**"In this entire project i uses Nginx instead of traefik because Nginx is simpler and widely used in production environments, making it easier to explain and configure manually. Traefik is great for dynamic environments, but for this project, I wanted to show clear control over routing."**

## Architecture :

* Frontend (Nginx) → Serves the static website
* Backend (Node.js) → REST API
* Database (MongoDB) → Data persistence
* Reverse Proxy (Nginx) → Routes traffic between frontend and backend


