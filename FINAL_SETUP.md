# Freshmart — Local Setup and Launch Guide

## Requirements
- Node.js 22
- npm
- MongoDB locally or a MongoDB replica-set connection string

## Install
Run from the repository root:

    git clone https://github.com/Neemasree/E-Commerce-Website.git
    cd E-Commerce-Website
    npm --prefix backend install
    npm --prefix frontend install

## Configure backend
Copy backend/.env.example to backend/.env and set MONGO_URI, a unique JWT_SECRET of at least 32 characters, PORT=5000, and CORS_ORIGINS for your frontend origin. Never commit environment files or credentials.

## Provision an administrator (optional)
There are no default admin/demo credentials. Add ADMIN_NAME, ADMIN_EMAIL, and a unique ADMIN_PASSWORD of at least 12 characters to the ignored backend/.env file, then run:

    npm --prefix backend run create-admin

The script does not print the password. Remove the admin password from the environment after provisioning if it is no longer needed.

## Seed the sample catalog (optional)

    npm --prefix backend run seed

Seeding is explicit. The server does not create default accounts or sample products on startup.

## Start the applications
Terminal 1:

    npm --prefix backend run dev

Terminal 2:

    npm --prefix frontend run dev

Open http://localhost:5173. The API defaults to http://localhost:5000 and its readiness endpoint is /health. Configure frontend/.env.local from frontend/.env.example with VITE_API_BASE_URL ending in /api.

## Run checks

    npm test --prefix backend
    npm run lint --prefix frontend
    npm run build --prefix frontend

For the real MongoDB integration test locally, set MONGO_INTEGRATION_URI to a replica-set URI. CI provisions a disposable MongoDB 7 replica set automatically.

## Payment notes
Cash on Delivery is the only implemented payment method. Card and UPI payments are not processed. No demo customer or admin credentials are shipped.

## Deployment
A Render Blueprint is included in render.yaml. Configure a MongoDB replica-set URI, confirm the generated API/frontend URLs, verify the API health endpoint, and manually test customer and admin journeys after deployment. Blueprint configuration is not proof of a live deployment.
