# Rahmah Responders - First Aid Training Platform

## Overview
A comprehensive first aid training and emergency response platform that provides multiple user interfaces for different roles: students, examiners, emergency reporters, and emergency responders.

**Current Status**: Successfully migrated from Lovable to Replit with all core functionality working. Emergency Responder Dashboard has been added with real-time emergency case monitoring.

## Project Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (TanStack Query) for server state
- **UI Components**: Radix UI primitives via shadcn/ui

### Backend (Express + TypeScript)
- **Framework**: Express.js with TypeScript
- **Storage**: In-memory storage (MemStorage) with full CRUD operations
- **API**: RESTful endpoints for emergency cases management
- **Schema**: Drizzle ORM schemas with Zod validation

### Data Model
- **Users**: Basic user management (id, username, password)
- **Emergency Cases**: Complete emergency reporting system with:
  - Type, description, location coordinates
  - Reporter information, severity levels
  - Status tracking (pending → dispatched → resolved)
  - Timestamps for real-time monitoring

## User Roles & Features

### 1. Student Dashboard
- Study flashcards for first aid concepts
- Take practice quizzes and final tests
- Track learning progress
- Book practical test appointments
- Access emergency response training after certification

### 2. Examiner Dashboard
- Create and manage learning content
- View student results and progress
- Manage practical test bookings
- Grade assessments

### 3. Emergency Reporter (Civilian)
- Report medical emergencies with GPS location
- Provide detailed incident descriptions
- Contact information for follow-up
- Severity level classification

### 4. Emergency Responder ⭐ **NEW**
- **Real-time Emergency Map**: Visual map showing all active cases
- **Case Management**: View, respond to, and resolve emergency cases
- **Status Updates**: Change case status (pending → dispatched → resolved)
- **Case Details**: Complete incident information with reporter contact
- **Statistics Dashboard**: Active cases count, severity distribution
- **Google Maps Integration**: Direct links to case locations

## Recent Changes (January 19, 2024)

### Migration from Lovable to Replit ✅
- Fixed routing from React Router to Wouter
- Installed missing dependencies (sonner package)
- Created proper query client configuration
- Server now runs successfully on port 5000

### Emergency Responder System Implementation ✅
- **Database Schema**: Added emergency_cases table with full case tracking
- **API Endpoints**: 
  - `GET /api/emergency-cases` - Fetch all cases
  - `GET /api/emergency-cases/:id` - Get specific case
  - `POST /api/emergency-cases` - Create new emergency report
  - `PATCH /api/emergency-cases/:id/status` - Update case status
- **Storage Layer**: Extended MemStorage with emergency case CRUD operations
- **Frontend Dashboard**: Complete Emergency Responder interface with:
  - Interactive SVG map with clickable markers
  - Real-time case status updates
  - Detailed case information dialogs
  - Response team dispatch functionality
  - Google Maps integration for navigation

### Technical Architecture Updates
- **Schema Types**: Added EmergencyCase and InsertEmergencyCase types
- **API Integration**: Connected dashboard to real backend APIs
- **Real-time Updates**: Query invalidation for live data synchronization
- **Error Handling**: Comprehensive error states and user feedback

## Development Guidelines

### Code Style
- Use TypeScript for all new components
- Follow shadcn/ui patterns for consistent styling
- Implement proper error handling with user-friendly messages
- Use React Query for all API interactions
- Maintain type safety with shared schema definitions

### API Design
- RESTful endpoints with proper HTTP status codes
- Zod validation for all request bodies
- Consistent error response format
- Use storage interface for all data operations

### UI/UX Principles
- Clear visual hierarchy with severity-based color coding
- Real-time feedback for user actions
- Responsive design for mobile emergency reporting
- Accessible components with proper ARIA labels

## Future Enhancements
- WebSocket integration for real-time map updates
- Push notifications for emergency responders
- Advanced map features (clustering, filtering)
- Mobile app for emergency reporters
- Integration with actual emergency services APIs
- GPS-based automatic location detection
- Multi-language support for diverse user base

## Technical Notes
- Server runs on port 5000 (Replit requirement)
- Uses in-memory storage (easily replaceable with database)
- Hot reload enabled for development
- All components are fully typed with TypeScript
- Query client configured with appropriate stale times for real-time data

## User Preferences
*No specific user preferences recorded yet*