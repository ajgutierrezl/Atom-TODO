# Task Management Application

A full-stack task management application built with Angular for the frontend and Express + TypeScript + Firebase for the backend.

## Features

- User authentication with automatic account creation
- Task listing sorted by creation date
- Task creation with title and description
- Editing and deletion of existing tasks
- Mark tasks as completed
- Responsive design for various devices

## Project Structure

- **todo-app/**: Angular frontend application
- **backend/**: Express API with TypeScript and Firebase

## Architecture

This application follows a clean architecture approach with separate concerns:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Angular UI     │────▶│  Express API    │────▶│  Firestore DB   │
│  (Presentation) │     │  (Business)     │     │  (Data)         │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Design Patterns
- **Frontend**: Component-based architecture, Observable pattern with RxJS, Services for data access
- **Backend**: Repository pattern, Service layer pattern, Dependency injection

## Prerequisites

- Node.js (version 14 or higher, recommended v16.x)
- Angular CLI (version 17.x)
- Firebase account with Firestore enabled
- TypeScript (version 5.x)

## Quick Start

### Frontend (Angular)

1. Navigate to the frontend directory:
   ```
   cd TODO-Atom/todo-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Access the application at http://localhost:4200

### Backend (Express + TypeScript + Firebase)

1. Navigate to the backend directory:
   ```
   cd TODO-Atom/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure Firebase:
   - Create a project in Firebase (https://console.firebase.google.com/)
   - Generate a new private key in the project settings
   - Copy `.env.example` to `.env` and update the variables with your credentials

4. Start the backend in development mode:
   ```
   npm run dev
   ```

5. The API will be available at http://localhost:5000

## Technologies

### Frontend
- Angular 17
- Angular Material
- RxJS
- TypeScript

### Backend
- Express.js
- TypeScript
- Firebase Firestore
- Cors
- Dotenv

## Database Structure

### Users Collection
- id (string)
- email (string)
- createdAt (timestamp)

### Tasks Collection
- id (string)
- title (string)
- description (string)
- completed (boolean)
- createdAt (timestamp)
- userId (string)

## API Endpoints

### Users
- `POST /api/users/login` - Check if a user exists
- `POST /api/users` - Create a new user

### Tasks
- `GET /api/tasks` - Get all tasks for a user
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task

## Deployment

### Frontend
To build the frontend for production:
```
cd TODO-Atom/todo-app
npm run build
```

### Backend
To build the backend for production:
```
cd TODO-Atom/backend
npm run build
```

## Troubleshooting

### Common Issues

1. **Firebase Configuration Issues**
   - **Problem**: "Error: Failed to initialize Firebase app"
   - **Solution**: Verify your Firebase credentials in the `.env` file and ensure the Firestore API is enabled in Google Cloud Console.

2. **CORS Errors**
   - **Problem**: "Access to fetch at 'http://localhost:5000/api' from origin 'http://localhost:4200' has been blocked by CORS policy"
   - **Solution**: Ensure the backend CORS middleware is properly configured to allow your frontend origin.

3. **Missing Firestore Index**
   - **Problem**: "Error: 9 FAILED_PRECONDITION: The query requires an index"
   - **Solution**: Follow the link in the error message to create the required composite index in Firebase Console.

4. **Node Version Issues**
   - **Problem**: "Error: The module was compiled against a different Node.js version"
   - **Solution**: Use NVM to switch to the recommended Node.js version: `nvm use 16`

## Contributing

We welcome contributions to improve the Task Management Application!

### Contributing Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style
- Follow the existing code style
- Write clear, commented code
- Add tests for new features when possible

## Roadmap

Future planned enhancements:
- Task categories and tagging
- Due dates and reminders
- User profiles and settings
- Team collaboration features
- Mobile application

## License

This project is licensed under the ISC License