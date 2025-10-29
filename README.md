# E-Commerce Product Management System

A full-stack application for managing products with React, Node.js, MySQL, and Kubernetes.

## What It Does

Manage product catalog - add, view, edit, and delete products with name, description, price, and stock quantity.

## Tech Stack

- **Frontend**: React 18
- **Backend**: Node.js + Express
- **Database**: MySQL 8.0
- **Deployment**: Kubernetes + Docker

## Project Structure

```
ecommerce-app/
├── server/              # Backend (Node.js API)
├── client/              # Frontend (React UI)
├── k8s/                 # Kubernetes configs
├── Dockerfile           # Container build file
└── README.md
```

## Key Files

### server/server.js
Main backend file with API routes and database connection.

### client/src/App.js
React component with UI and user interactions.

### Dockerfile
Builds both frontend and backend in single image.

### k8s/deployment.yaml
Deploys MySQL database and application with auto-scaling.

### k8s/service.yaml
Creates network service routing traffic to app.

### k8s/ingress.yaml
Provides external access via Nginx.

## How It Works

User → Ingress → Service → App Pod → MySQL Database

1. User opens app in browser
2. Ingress routes traffic to Service
3. Service forwards to App pod
4. App serves React UI
5. User actions trigger API calls
6. Backend queries MySQL database
7. Data stored/retrieved and sent back

## Features

- CRUD operations for products
- Responsive design
- Auto-scaling
- Health monitoring
- Secure with rate limiting

## License

MIT

---

**React + Node.js + MySQL + Kubernetes**
