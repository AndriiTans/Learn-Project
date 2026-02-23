# Frontend - Backoffice

React + TypeScript frontend for backoffice task management system.

## Features

- ✅ **Mock API Mode** - Work without backend (for development)
- ✅ **Auth Integration** - AWS Cognito (with mock mode)
- ✅ **Task Management** - View, start, complete tasks
- ✅ **Systems Management** - CRUD operations for systems
- ✅ **Dashboard** - Task statistics and overview
- ✅ **TypeScript** - Full type safety
- ✅ **Zustand** - State management
- ✅ **React Router** - Client-side routing

## Environment Variables

Create `.env` file in `/services/frontend/`:

```env
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_MOCK_API=true

# Auth Configuration
VITE_MOCK_AUTH=true
VITE_AWS_REGION=eu-central-1
VITE_COGNITO_USER_POOL_ID=
VITE_COGNITO_CLIENT_ID=
VITE_COGNITO_DOMAIN=
VITE_APP_URL=http://localhost:5173
```

## Development

```bash
# Install dependencies
npm install

# Run dev server (with mock API)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Mock Mode

When `VITE_MOCK_API=true` and `VITE_MOCK_AUTH=true`:
- All API requests return mock data
- No backend required
- Perfect for frontend development

Toggle mock mode at runtime using the button in the nav bar.

## Project Structure

```
src/
├── components/       # Reusable components
│   └── Layout.tsx
├── pages/           # Page components
│   ├── Dashboard.tsx
│   ├── Tasks.tsx
│   ├── Systems.tsx
│   └── Login.tsx
├── lib/             # Libraries and utilities
│   ├── api/        # API client and mock data
│   │   ├── client.ts
│   │   ├── backoffice.ts
│   │   └── mock-data.ts
│   └── auth/       # Auth configuration
│       └── config.ts
├── store/          # Zustand stores
│   ├── useAuthStore.ts
│   └── useTaskStore.ts
├── types/          # TypeScript types
│   └── index.ts
├── App.tsx         # Main app component
├── main.tsx        # Entry point
└── styles.css      # Global styles
```

## API Integration

The app supports two modes:

### 1. Mock Mode (Development)
```typescript
// Uses mock-data.ts
VITE_MOCK_API=true
```

### 2. Real API Mode (Production)
```typescript
// Connects to backoffice API
VITE_MOCK_API=false
VITE_API_URL=http://localhost:3001
```

## Authentication

### Mock Auth (Development)
```typescript
VITE_MOCK_AUTH=true
// Any credentials work
```

### AWS Cognito (Production)
```typescript
VITE_MOCK_AUTH=false
VITE_COGNITO_USER_POOL_ID=your-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id
```

## Docker

```bash
# Development
docker-compose -f docker-compose.dev.yml up frontend

# Production
docker-compose up frontend
```

## Available Routes

- `/` - Dashboard (protected)
- `/tasks` - Task management (protected)
- `/systems` - Systems CRUD (protected)
- `/login` - Login page (public)

## State Management

### Auth Store
```typescript
const { user, isAuthenticated, logout } = useAuthStore();
```

### Task Store
```typescript
const { currentTask, myTasks, setCurrentTask } = useTaskStore();
```

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **AWS Amplify** - Auth (optional)
- **date-fns** - Date utilities
