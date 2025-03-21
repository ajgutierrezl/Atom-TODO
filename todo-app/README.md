# Todo App Frontend

A responsive Angular application for task management with a clean and intuitive user interface.

## Features

- User authentication via email
- Task creation with validation
- Task list with filtering and sorting
- Task editing and deletion
- Task completion tracking
- Material Design UI components

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/          # User authentication component
│   │   ├── task-form/      # Form for task creation
│   │   ├── task-item/      # Individual task display component
│   │   └── task-list/      # Main task listing component
│   ├── models/
│   │   ├── task.model.ts   # Task data interfaces
│   │   └── user.model.ts   # User data interfaces
│   ├── services/
│   │   ├── auth.service.ts # Authentication service
│   │   └── task.service.ts # Task management service
│   └── app-routing.module.ts # Application routes
├── environments/
│   └── environment.ts      # Environment configuration
└── assets/
    └── styles/            # Global styles
```

## Prerequisites

- Node.js (version 14 or higher)
- Angular CLI (version 17 or higher)
- A running instance of the backend API

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Update API URL in environment configuration:
   - Open `src/environments/environment.ts`
   - Update the `apiUrl` to match your backend URL (default is `http://localhost:5000/api`)

## Development

Run the development server:
```
ng serve
```

The application will be available at `http://localhost:4200` and will automatically reload when you change source files.

## Data Models

### Task Model
```typescript
interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  userId: string;
}

// Data Transfer Object for creating a task
interface CreateTaskDTO {
  title: string;
  description: string;
  userId: string;
}

// Data Transfer Object for updating a task
interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}
```

### User Model
```typescript
interface User {
  id?: string;
  email: string;
  createdAt?: Date;
}
```

## Application Routes

| Path       | Component        | Guard        | Description                   |
|------------|------------------|--------------|-------------------------------|
| `/login`   | LoginComponent   | -            | User login/registration page  |
| `/tasks`   | TaskListComponent| AuthGuard    | Main task management page     |
| `**`       | Redirects to login | -          | Handles unknown routes        |

The `AuthGuard` ensures that only authenticated users can access the tasks page.

## Service Examples

### Authentication Service

```typescript
// Example usage of AuthService
import { AuthService } from './services/auth.service';

// In your component constructor
constructor(private authService: AuthService) {}

// Login with email
this.authService.login(email).subscribe({
  next: (user) => {
    // Handle successful login
    console.log('Logged in user:', user);
  },
  error: (error) => {
    // Handle user not found
    console.error('Login error:', error);
  }
});

// Register new user
this.authService.register(email).subscribe({
  next: (user) => {
    // Handle successful registration
    console.log('Registered user:', user);
  },
  error: (error) => {
    // Handle registration error
    console.error('Registration error:', error);
  }
});

// Check login status
const isLoggedIn = this.authService.isLoggedIn();

// Logout
this.authService.logout();
```

### Task Service

```typescript
// Example usage of TaskService
import { TaskService } from './services/task.service';

// In your component constructor
constructor(private taskService: TaskService) {}

// Get all tasks
this.taskService.getTasks().subscribe(tasks => {
  console.log('Tasks:', tasks);
});

// Create a task
const newTask = {
  title: 'Complete project',
  description: 'Finish the task management app',
  userId: 'user123'
};

this.taskService.createTask(newTask).subscribe(task => {
  console.log('Created task:', task);
});

// Update a task
this.taskService.updateTask('task123', { completed: true }).subscribe(task => {
  console.log('Updated task:', task);
});

// Delete a task
this.taskService.deleteTask('task123').subscribe(() => {
  console.log('Task deleted successfully');
});
```

## Component Overview

### Login Component
- Handles user authentication
- Provides user creation for new users
- Redirects to the task list on successful login

### Task List Component
- Displays all tasks for the logged-in user
- Handles task sorting and filtering
- Contains task form for creating new tasks
- Manages logout functionality

### Task Item Component
- Displays individual task details
- Provides toggle for task completion
- Contains edit and delete functionality

### Task Form Component
- Validates task input
- Creates new tasks
- Shows loading state during submission

## Customizing Styles

### Theme Customization

The application uses Angular Material theming. To customize the theme:

1. Open `src/styles.scss`
2. Modify the primary, accent, and warn palettes:

```scss
@use '@angular/material' as mat;

$todo-app-primary: mat.define-palette(mat.$indigo-palette);
$todo-app-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$todo-app-warn: mat.define-palette(mat.$red-palette);

$todo-app-theme: mat.define-light-theme((
  color: (
    primary: $todo-app-primary,
    accent: $todo-app-accent,
    warn: $todo-app-warn,
  )
));

@include mat.all-component-themes($todo-app-theme);
```

### Component Styling

Each component has its own SCSS file (e.g., `task-item.component.scss`). To maintain consistent styling:

- Use BEM (Block Element Modifier) naming convention
- Leverage Angular Material mixins for consistency
- Keep component-specific styles in their respective files
- Use global styles only for application-wide styling

## Best Practices

### Performance Optimization
- Use `trackBy` with `*ngFor` to optimize rendering
- Implement OnPush change detection for performance
- Unsubscribe from observables in `ngOnDestroy`

### State Management
- Use services for cross-component communication
- Leverage RxJS operators for data transformation
- Consider using NgRx for more complex state management needs

### Error Handling
- Implement proper error handling in service calls
- Display user-friendly error messages
- Log errors for debugging

## Building for Production

To build the application for production:
```
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Testing

### Unit Tests
```
ng test
```

### End-to-End Tests
```
ng e2e
```

## Debugging

For debugging issues:
1. Open DevTools in browser (F12)
2. Check Console for errors
3. Use Network tab to inspect API calls
4. Utilize Angular DevTools extension for component debugging

## Further Help

For more information on Angular development:
- [Angular Documentation](https://angular.io/docs)
- [Angular CLI Documentation](https://angular.io/cli)
- [Angular Material Documentation](https://material.angular.io/)
