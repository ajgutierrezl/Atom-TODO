# Task Management API

A RESTful API for task management built with Express, TypeScript, and Firebase Firestore.

## Features

- User authentication and management
- Task CRUD operations
- Structured error handling
- Environment-based configuration
- TypeScript type safety

## Project Structure

```
src/
├── config/
│   └── firebase.ts       # Firebase initialization
├── controllers/
│   ├── task.controller.ts # Task endpoints handlers
│   └── user.controller.ts # User endpoints handlers
├── middleware/
│   └── error.middleware.ts # Error handling middleware
├── models/
│   ├── task.model.ts     # Task data models and interfaces
│   └── user.model.ts     # User data models and interfaces
├── routes/
│   ├── task.routes.ts    # Task endpoint routes
│   └── user.routes.ts    # User endpoint routes
├── services/
│   ├── task.service.ts   # Task business logic
│   └── user.service.ts   # User business logic
└── index.ts              # Application entry point
```

## Prerequisites

- Node.js (version 14 or higher)
- Firebase project with Firestore database
- Firebase service account key

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the Firebase service account information in the `.env` file

   Example `.env` file:
   ```
   PORT=5000
   NODE_ENV=development
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
   ```

3. Enable the Firestore API in Firebase:
   - Go to the Google Cloud Console: https://console.cloud.google.com
   - Select your project
   - Search for "Firestore API" and enable it

## Development

Start the development server with hot-reload:
```
npm run dev
```

The API will be available at `http://localhost:5000` (or the port you specified in `.env`).

## API Endpoints

### Users

| Method | Endpoint        | Description              | Request Body         | Response              |
|--------|-----------------|--------------------------|----------------------|-----------------------|
| POST   | /api/users/login| Authenticate a user      | `{ email: string }`  | User object or 404    |
| POST   | /api/users      | Create a new user        | `{ email: string }`  | Created user object   |

### Tasks

| Method | Endpoint        | Description              | Request Body                            | Response              |
|--------|-----------------|--------------------------|----------------------------------------|-----------------------|
| GET    | /api/tasks      | Get user's tasks         | Query param: `userId`                  | Array of task objects |
| GET    | /api/tasks/:id  | Get a specific task      | -                                      | Task object or 404    |
| POST   | /api/tasks      | Create a new task        | `{ title, description, userId }`       | Created task object   |
| PUT    | /api/tasks/:id  | Update a task            | `{ title?, description?, completed? }` | Updated task object   |
| DELETE | /api/tasks/:id  | Delete a task            | -                                      | 204 No Content        |

## API Request & Response Examples

### User Login

**Request:**
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "id": "user123",
  "email": "user@example.com",
  "createdAt": "2023-06-15T14:30:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

### Create User

**Request:**
```http
POST /api/users
Content-Type: application/json

{
  "email": "newuser@example.com"
}
```

**Success Response (201 Created):**
```json
{
  "id": "user456",
  "email": "newuser@example.com",
  "createdAt": "2023-06-18T09:15:30.000Z"
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "User already exists"
}
```

### Get Tasks

**Request:**
```http
GET /api/tasks?userId=user123
```

**Success Response (200 OK):**
```json
[
  {
    "id": "task1",
    "title": "Complete project",
    "description": "Finish the task management app",
    "completed": false,
    "createdAt": "2023-06-16T10:00:00.000Z",
    "userId": "user123"
  },
  {
    "id": "task2",
    "title": "Write documentation",
    "description": "Create README files",
    "completed": true,
    "createdAt": "2023-06-17T09:30:00.000Z",
    "userId": "user123"
  }
]
```

### Create Task

**Request:**
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Learn TypeScript",
  "description": "Complete TypeScript course",
  "userId": "user123"
}
```

**Success Response (201 Created):**
```json
{
  "id": "task3",
  "title": "Learn TypeScript",
  "description": "Complete TypeScript course",
  "completed": false,
  "createdAt": "2023-06-18T14:45:00.000Z",
  "userId": "user123"
}
```

## Data Validation

### Validation Strategy

The API implements several layers of validation:

1. **Express Middleware Validation**
   - Checks if required fields are present
   - Validates data types
   - Returns 400 Bad Request if validation fails

2. **Service Layer Validation**
   - Performs business logic validation
   - Ensures data consistency

3. **TypeScript Type Safety**
   - Uses interfaces for data models
   - Provides compile-time type checking

### Validation Examples

#### Task Creation Validation

```typescript
// Controller validation for creating a task
if (!taskDTO.title || !taskDTO.description || !taskDTO.userId) {
  res.status(400).json({ error: 'Incomplete data' });
  return;
}

// TypeScript interface for task creation
interface CreateTaskDTO {
  title: string;
  description: string;
  userId: string;
}
```

## Error Handling

### Error Handling Strategy

The API implements a centralized error handling approach:

1. **Controller-level try/catch**
   - Catches errors at the request handling level
   - Logs errors with relevant context
   - Returns appropriate HTTP status codes

2. **Service-level error handling**
   - Domain-specific error handling
   - Returns null or throws specific errors

3. **Global error middleware**
   - Catches uncaught exceptions
   - Prevents server crashes
   - Returns standardized error responses

### Error Response Structure

All error responses follow this structure:
```json
{
  "error": "Error message",
  "details": "Optional detailed explanation (only in development)"
}
```

## Security Implementation

### API Security Measures

1. **CORS Configuration**
   - Restricts API access to allowed origins
   - Prevents cross-site request forgery

   ```typescript
   // CORS configuration
   app.use(cors({
     origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

2. **Environment Variables**
   - Sensitive configuration stored in environment variables
   - Firebase credentials securely managed

3. **Input Sanitization**
   - All user inputs are validated and sanitized
   - Prevents injection attacks

4. **Firebase Security Rules**
   - Additional security layer at the database level
   - Restricts data access based on authentication

### Recommended Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
                          resource.data.userId == request.auth.uid;
    }
  }
}
```

## Scalability Considerations

### Current Architecture Scalability

The application is designed with scalability in mind:

1. **Stateless API Design**
   - No server-side session state
   - Horizontally scalable

2. **Firebase Firestore**
   - Cloud-based NoSQL database
   - Automatic scaling capabilities
   - High read/write performance

### Scaling Strategies

For handling increased traffic:

1. **Deployment Options**
   - Deploy to container orchestration (Kubernetes)
   - Use serverless with Firebase Cloud Functions
   - Implement load balancing

2. **Caching**
   - Implement Redis for frequently accessed data
   - Use browser caching for static resources

3. **Query Optimization**
   - Create appropriate Firestore indexes
   - Implement pagination for large datasets
   - Use composite queries efficiently

## Building for Production

Compile TypeScript to JavaScript:
```
npm run build
```

The compiled files will be in the `dist/` directory.

## Running in Production

Start the compiled application:
```
npm start
```

For production deployment, consider:
- Setting NODE_ENV=production
- Using a process manager like PM2
- Setting up monitoring and logging

## Testing

Tests to be implemented. Run placeholder test command:
```
npm test
```

## Performance Monitoring

For tracking API performance:
- Implement logging with Winston
- Use Firebase Performance Monitoring
- Consider APM solutions like Datadog or New Relic

## Firebase Firestore Data Model

### Users Collection
```
users/
  - {userId}/
    - email: string
    - createdAt: timestamp
```

### Tasks Collection
```
tasks/
  - {taskId}/
    - userId: string
    - title: string
    - description: string
    - completed: boolean
    - createdAt: timestamp
```

## Troubleshooting

### Common API Issues

1. **Firebase Connection Failures**
   - Check Firebase credentials in .env
   - Verify Firestore API is enabled
   - Check if Firebase project billing is enabled

2. **CORS Issues**
   - Verify CORS configuration matches frontend origin
   - Check for typos in allowed origins

3. **Validation Errors**
   - Check request payload format
   - Ensure all required fields are provided
   - Verify data types match expected types

## License

This project is licensed under the ISC License 