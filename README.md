# SprintPilot

SprintPilot is a full-stack project management app for teams that need a simple way to organize projects and track tasks through a Kanban board.

It includes authentication, project management, task management, status updates, search, filtering, and a deployment-ready Node + React setup.

## What This App Does

Users can:

- sign up and log in
- create, edit, and delete projects
- open a project and manage its tasks
- move tasks across workflow stages
- change task status directly from each task card
- search tasks by title
- filter tasks by status
- view task counts per project on the dashboard

## Workflow

Each project contains tasks grouped by status:

- Backlog
- To Do
- In Progress
- On Hold
- Done

Tasks can be updated in two ways:

- by drag and drop across columns
- by selecting a new status from the task card

## Tech Stack

### Frontend

- React
- React Router
- Vite
- Axios
- Plain CSS

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT authentication
- bcrypt password hashing
- express-validator

## Project Structure

```text
.
|-- client
|   |-- src
|   |-- public
|   `-- package.json
|-- server
|   |-- src
|   `-- package.json
|-- package.json
`-- README.md
```

## Main Screens

### Authentication

- login and signup UI
- JWT-based authentication
- protected app routes after login

### Dashboard

- project list
- project name
- project description
- number of tasks
- created date
- create/edit/delete project actions

### Project Board

- board view with status columns
- create/edit/delete task actions
- expand task cards to view full description
- search and filter controls

## Data Models

### Project

```json
{
  "id": "unique-id",
  "name": "Website Redesign",
  "description": "Project description",
  "createdAt": "date"
}
```

### Task

```json
{
  "id": "unique-id",
  "projectId": "project-id",
  "title": "Create landing page",
  "description": "Task description",
  "status": "backlog | todo | in-progress | on-hold | done",
  "assignedTo": "optional",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## API Endpoints

All API routes are mounted under `/api`.

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Projects

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Tasks

- `POST /api/projects/:id/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment files

Create:

- `server/.env`
- `client/.env`

You can copy from:

- `server/.env.example`
- `client/.env.example`

### 3. Configure environment variables

Example `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Example `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the app

Run both frontend and backend:

```bash
npm run dev
```

Or run them separately:

Backend:

```bash
npm run dev --workspace server
```

Frontend:

```bash
npm run dev --workspace client
```

### 5. Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

## Production Build

Build the frontend from the repository root:

```bash
npm run build
```

The frontend output is generated in `client/dist`.

In production, the Express server serves this build directly, so the app can be deployed as a single service.

## Deployment

## Recommended Option: Render

This project is configured to deploy as one Render Web Service.

You do not need to deploy the frontend separately.

### Render Settings

- Root Directory: leave empty
- Build Command:

```bash
npm install && npm run build
```

- Start Command:

```bash
NODE_ENV=production npm run start
```

### Render Environment Variables

Add these in Render:

```env
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=https://your-render-service.onrender.com
```

### Why only one deployment is needed

- the React app is built during the Render build step
- Express serves the built frontend in production
- API requests use `/api` in production
- frontend and backend share the same deployed domain

## MongoDB Atlas Setup

To use MongoDB Atlas:

1. Create a cluster
2. Create a database user
3. Add network access rules
4. Copy the Atlas connection string
5. Put that string into `MONGODB_URI`

If Atlas credentials are wrong, authentication requests and all project/task actions will fail.

## How to Verify the App

After running locally or deploying:

1. Open `/auth`
2. Create a new account
3. Log in
4. Create a project
5. Open the project board
6. Add tasks
7. Expand a task card to read the full description
8. Change task status
9. Drag a task to another column
10. Search by task title
11. Filter by status
12. Delete a task
13. Delete a project

You can also verify the backend with:

```text
/api/health
```

Expected response:

```json
{
  "message": "API is running"
}
```

## Available Scripts

From the repository root:

```bash
npm run dev
npm run build
npm run start
```

## Notes

- authentication is JWT-based
- passwords are hashed before storage
- project and task APIs are protected
- validation is included on both auth and task/project input
- this app is intended to be simple, readable, and easy to deploy

## Future Improvements

- priorities and due dates
- comments on tasks
- team/member management
- notifications
- automated tests
- activity history
