# TuriumCorp SRE Dashboard

A modern, real-time Site Reliability Engineering (SRE) Dashboard built with Next.js 14, designed to monitor and manage microservices infrastructure with exceptional performance and user experience.

## 🚀 Features

### Core Functionality
- **Real-time Service Monitoring**: Live status updates with 15-second polling intervals
- **Service Management**: Full CRUD operations for services with optimistic updates
- **Advanced Filtering & Search**: Filter by status, type, and search by name
- **Responsive Design**: Mobile-first approach with modern UI/UX patterns
- **Dark/Light Theme**: Seamless theme switching with system preference detection

### Technical Excellence
- **State Management**: Sophisticated React Query + Zustand architecture
- **Performance**: Intelligent caching strategies and background synchronization
- **Error Handling**: Comprehensive error boundaries and user notifications
- **Animations**: Smooth micro-interactions using Framer Motion
- **Type Safety**: Full TypeScript implementation with strict typing

### Advanced Features
- **Optimistic Updates**: Immediate UI feedback with rollback on failure
- **Background Sync**: Data updates when returning to browser tab
- **Infinite Scrolling**: Efficient handling of large datasets
- **Real-time Polling**: Live status updates without page refresh
- **Professional UI**: Production-ready interface with attention to detail

## 🏗️ Architecture

### State Management Strategy
Our application implements a sophisticated state management architecture that separates concerns and optimizes performance:

#### Server State (React Query)
- **Services Data**: Cached with 5-minute stale time, 10-minute garbage collection
- **Real-time Updates**: Background polling every 15 seconds
- **Optimistic Updates**: Immediate UI feedback with automatic rollback
- **Smart Caching**: Differential data fetching and request deduplication

#### Client State (Zustand)
- **UI State**: Theme, sidebar, notifications
- **Persistence**: Local storage for user preferences
- **Real-time Updates**: Immediate state synchronization

### Data Flow Architecture
```
User Action → Optimistic Update → API Call → Success/Error → Cache Update → UI Sync
     ↓              ↓              ↓          ↓            ↓          ↓
  UI Update    Immediate      Network    Handle      Invalidate   Re-render
              Feedback        Request    Response    Queries
```

### Caching Strategy
- **Services List**: Long-lived cache (5 min stale, 10 min GC)
- **Service Details**: Medium-lived cache (2 min stale)
- **Events**: Short-lived cache (1 min stale)
- **Status Polling**: Always fresh (0 stale time)

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14**: App Router with TypeScript
- **React 18**: Latest features and concurrent rendering
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Advanced animations and micro-interactions

### State Management
- **TanStack Query (React Query)**: Server state management
- **Zustand**: Client state management
- **React Query DevTools**: Development debugging

### Styling & UI
- **Tailwind CSS**: Responsive design system
- **CSS-in-JS**: Dynamic styling capabilities
- **Lucide React**: Beautiful, consistent icons
- **Custom Design System**: Consistent spacing, typography, and colors

### Development Tools
- **TypeScript**: Strict typing throughout
- **ESLint**: Code quality and consistency
- **MSW**: Mock Service Worker for API simulation
- **Jest**: Testing framework (configured)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   │   ├── Button.tsx    # Advanced button component
│   │   ├── StatusBadge.tsx # Service status indicators
│   │   └── Toaster.tsx   # Notification system
│   └── providers/        # Context providers
│       └── Providers.tsx # App-wide providers
├── hooks/                 # Custom React hooks
│   └── useServices.ts    # Service data management
├── lib/                   # Utility libraries
│   ├── mock-api.ts       # Mock API implementation
│   ├── react-query.ts    # Query client configuration
│   └── utils.ts          # Helper functions
├── store/                 # State management
│   └── index.ts          # Zustand store
└── types/                 # TypeScript definitions
    └── index.ts          # Application types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd turium
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🔧 Configuration

### Environment Variables
The application uses mock data by default. For production, you can configure:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.turiumcorp.com
NEXT_PUBLIC_POLLING_INTERVAL=15000

# Feature Flags
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### Mock API Configuration
The mock API simulates real-world conditions:
- **Network Latency**: 300-1000ms random delays
- **Error Rate**: ~5% failure probability
- **Real-time Updates**: Simulated status changes every 15 seconds

## 🧪 Testing Strategy

### Testing Stack
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **MSW**: API mocking for tests
- **Playwright**: End-to-end testing (configured)

### Test Coverage
- **Unit Tests**: Individual component testing
- **Integration Tests**: Hook and API testing
- **E2E Tests**: Critical user flow testing
- **Performance Tests**: Lighthouse CI integration
