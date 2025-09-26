# Secure multi-container webapp using docker-compose and Nginx reverse proxy

**"I built a production-like Docker setup with four containers: frontend, backend, database, and an Nginx reverse proxy. The reverse proxy routes requests — static website traffic goes to the frontend, while API requests go to the backend.
I used Docker secrets to manage sensitive database credentials, and volumes to persist MongoDB data. This setup ensures services are isolated, secure, and easy to deploy with Docker Compose."**

**"In this entire project i uses Nginx instead of traefik because Nginx is simpler and widely used in production environments, making it easier to explain and configure manually. Traefik is great for dynamic environments, but for this project, I wanted to show clear control over routing."**

## Architecture :

* **Frontend (Nginx) → Serves the static website**
* **Backend (Node.js) → REST API**
* **Database (MongoDB) → Data persistence**
* **Reverse Proxy (Nginx) → Routes traffic between frontend and backend**
---
### Step 1: Make sure you have installed all the dependencies (Install Docker & Docker-compose)

1. sudo su
2. sudo yum install docker.io
3. curl -SL https://github.com/docker/compose/releases/download/v2.30.3/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
4. chmod +x /usr/local/bin/docker-compose
5. docker-compose -v
---
### Step 2: Create Project Folder Structure

1. mkdir **multi-container**
2. cd **multi-container**
3. mkdir **frontend, backend, nginx, secrets** (inside the root folder multi-container)
4. creates a **docker-compose.yml file** (inside the root folder multi-container)
---
### Step 3: Frontend Setup

* **2.1 Create ```frontend/index.html```**

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Farming World</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #f0f8f5;
      color: #333;
    }

    header {
      background: #2e8b57;
      color: white;
      text-align: center;
      padding: 20px;
    }

    header h1 {
      margin: 0;
      font-size: 2.5rem;
    }

    nav {
      background: #3cb371;
      display: flex;
      justify-content: center;
      padding: 10px 0;
    }

    nav a {
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      font-weight: bold;
    }

    nav a:hover {
      background: #2e8b57;
      border-radius: 5px;
    }

    .hero {
      background: url('https://d17ocfn2f5o4rl.cloudfront.net/wp-content/uploads/2023/07/BP-AI-in-Agriculture-The-Future-of-Farming_body-im-3.jpg') no-repeat center center/cover;
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7);
      font-size: 2rem;
      font-weight: bold;
    }

    .content {
      padding: 20px;
      max-width: 800px;
      margin: auto;
    }

    .content h2 {
      color: #2e8b57;
    }

    footer {
      text-align: center;
      background: #2e8b57;
      color: white;
      padding: 10px 0;
      margin-top: 20px;
    }

    @media (max-width: 600px) {
      header h1 {
        font-size: 1.8rem;
      }
      .hero {
        font-size: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>Welcome to Farming World</h1>
    <p>Where agriculture meets innovation</p>
  </header>

  <nav>
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Techniques</a>
    <a href="#">Contact</a>
  </nav>

  <div class="hero">
    Farming for a Sustainable Future
  </div>

  <div class="content">
    <h2>About Farming</h2>
    <p>
      Farming is one of the oldest and most important human activities.
      It provides food, raw materials, and contributes to the economy.
      Modern farming techniques like smart irrigation, crop rotation,
      and sustainable practices are helping farmers increase yields
      while protecting the environment.
    </p>

    <h2>Sustainable Techniques</h2>
    <ul>
      <li>Crop rotation to maintain soil fertility.</li>
      <li>Using natural fertilizers and composting.</li>
      <li>Rainwater harvesting for irrigation.</li>
      <li>Precision farming with modern technology.</li>
    </ul>
  </div>

  <footer>
    <p>&copy; 2025 Farming World. All rights reserved.</p>
  </footer>
</body>
</html>
```
* **2.2 Create ```frontend/dockerfile```**

```FROM nginx:1.25-alpine

# Copy all frontend files
COPY ./ /usr/share/nginx/html

# Create required Nginx directories with full permissions
RUN mkdir -p /var/cache/nginx /var/run && \
    chmod -R 777 /var/cache/nginx /var/run

# Expose port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s CMD wget --spider -q http://localhost:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
```
---
### Step 3: Backend Setup

* **3.1 Create ```backend/app.js```**

```const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/secureapp';

app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.json({ message: "Secure Multi-Container Backend Running!" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
```

* **3.2 Create ```backend/package.json```**

```{
  "name": "secure-backend",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "mongoose": "^7.6.0"
  }
}
```

* **3.3 Create ```backend/dockerfile```**

```FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies files first
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy application files
COPY . .

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose backend port
EXPOSE 5000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s CMD wget --spider -q http://localhost:5000/ || exit 1

CMD ["npm", "start"]
```
---
### Step 4: Nginx Reverse Proxy

* **4.1 Create ```nginx/default.conf```**

```upstream frontend_service {
    server frontend:80;
}

upstream backend_service {
    server backend:5000;
}

server {
    listen 80;

    server_name localhost;

    # Route for Frontend
    location / {
        proxy_pass http://frontend_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Route for Backend API
    location /api/ {
        proxy_pass http://backend_service;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
### Step 5: MongoDB Password Secret

* **5.1 Create ```secrets/mongo_root_password.txt```**

```echo "Strong@123" > /home/ec2-user/secure-multi-container-app/secrets/mongo_root_password.txt```

---
### Step 6: Docker Compose Configuration

* **6.1 Create ```multi-container/docker-compose.yml```**

```version: '3.8'

services:
  reverse-proxy:
    image: nginx:1.25-alpine
    container_name: nginx_proxy
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "80:80"
    depends_on:
      - frontend
      - backend
    networks:
      - app_network
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: secure_frontend
    networks:
      - app_network

  backend:
    build: ./backend
    container_name: secure_backend
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://root:${MONGO_ROOT_PASSWORD}@mongo:27017/secureapp?authSource=admin
    secrets:
      - mongo_root_password
    depends_on:
      - mongo
    networks:
      - app_network

  mongo:
    image: mongo:6.0
    container_name: secure_mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD_FILE=/run/secrets/mongo_root_password
    volumes:
      - mongo_data:/data/db
    secrets:
      - mongo_root_password
    networks:
      - app_network

secrets:
  mongo_root_password:
    file: ./secrets/mongo_root_password.txt

volumes:
  mongo_data:

networks:
  app_network:
    driver: bridge
```
---

### Step 7: Build and Start the Containers

1. docker-compose build
2. docker-compose up -d

---

### Step 8: Verify the Setup

1. docker ps

---

### Step 9: Test the Application

* **Frontend:**

1. http://ec2-public-ip

* **Backend:**

1. http://ec2-public-ip/api

---

### Step 10: Test database connection:

* docker exec -it (mongodb-container-name) mongosh -u root -p (mongo-db-password)

