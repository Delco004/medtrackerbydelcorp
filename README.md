# MedTracker - Medical Tracking Application

A comprehensive React application for managing medical data, appointments, and medications.

## Project Overview

MedTracker is a full-featured health management system built with:
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Modern CSS with responsive design
- **Architecture**: Component-based with state management

## Features

- **Dashboard**: Overview of appointments, medications, and refill status
- **Appointments Management**: Schedule, track, and manage medical appointments
- **Medication Tracking**: Track medications, dosages, frequencies, and refill information
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Project Structure

```
src/
├── components/
│   ├── MedTracker.tsx      # Main app component
│   ├── Header.tsx          # App header
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── AppointmentList.tsx # Appointments management
│   └── MedicationTracker.tsx # Medications management
├── styles/
│   └── MedTracker.css      # Main application styles
├── App.tsx                 # Root component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build

Create an optimized production build:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

## Development Guidelines

- Use React hooks for state management
- Keep components modular and reusable
- Maintain responsive design principles
- Use TypeScript for type safety
- Follow modern CSS practices for styling

## Key Components

### MedTracker
Main component that manages:
- Tab-based navigation (Dashboard, Appointments, Medications)
- State for appointments and medications
- Data manipulation methods

### Header
Displays application title and current date

### Sidebar
Navigation menu with three main sections

### AppointmentList
Manages appointments with:
- Add new appointments
- View appointment details
- Delete appointments

### MedicationTracker
Manages medications with:
- Add new medications
- Track refill status
- Delete medications

## Styling

The application uses a modern gradient design with:
- Primary color: Purple gradient (#667eea to #764ba2)
- Cards and sections with box shadows
- Responsive grid layouts
- Mobile-first design approach

## Future Enhancements

- User authentication
- Data persistence (localStorage/database)
- Medication reminders/alerts
- Export medical records
- Doctor/pharmacy contacts
- Medical history timeline

      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
