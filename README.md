# Mini Project Management App

A full-stack project and task manager built with React, Vite, Node.js, Express, MongoDB, and JWT authentication.

## Features

- Signup and login with JWT-based auth
- Protected dashboard and project detail routes
- Create, edit, and delete projects
- Create, edit, delete, and update task status
- Search tasks by title
- Filter tasks by status
- Loading, error, and empty states
- Production-ready backend that can serve the built frontend

## Tech Stack

- Frontend: React, React Router, Vite, plain CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT + bcrypt password hashing
- Validation: express-validator

## Project Structure

```text
.
|-- client
|-- server
`-- README.md
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`

3. Add a MongoDB connection string in `server/.env`

4. Start both apps:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Deployment

This app is set up so the Express server can serve the frontend build in production.

### Render / Railway / VPS flow

1. Set the root build command:

```bash
npm install && npm run build
```

2. Set the start command:

```bash
npm run start
```

3. Add these environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `NODE_ENV=production`
- `PORT`

### MongoDB

Use MongoDB Atlas for deployment. Put the Atlas connection string into `MONGODB_URI`.

## Test Checklist

- Register a new user
- Login with the same user
- Create a project
- Open project details
- Add multiple tasks
- Edit task status
- Search by task title
- Filter by task status
- Delete a task
- Delete a project

## Notes

- API routes are mounted under `/api`
- In production, frontend routes are handled by Express after the Vite build
