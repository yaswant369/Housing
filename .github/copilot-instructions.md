# Copilot Instructions for Housing Codebase

## Big Picture Architecture
- **Monorepo Structure**: Contains `backend` (Node.js/Express) and `frontend` (React/Vite) folders. Each is independently runnable and developed.
- **Backend**: REST API server in `backend/` with models, routes, and middleware. Handles authentication, property management, subscriptions, and file uploads.
- **Frontend**: SPA in `frontend/` using React, Vite, and Tailwind CSS. Organized by features and pages, with reusable components and context for state management.

## Developer Workflows
- **Backend**:
  - Start: `npm start` or `node server.js` in `backend/`
  - Test: `npm test` or `node test_properties.js` in `backend/`
- **Frontend**:
  - Start: `npm run dev` in `frontend/`
  - Build: `npm run build` in `frontend/`
  - Lint: `npm run lint` in `frontend/`

## Project-Specific Conventions
- **File Uploads**: Properties images stored in `backend/uploads/properties/{propertyId}/`.
- **Auth**: Custom middleware in `backend/middleware/authMiddleware.js` and `backend/routes/auth.js`.
- **Premium Features**: Controlled by middleware and data in `backend/models/Subscription.js` and `frontend/src/data/premiumData.js`.
- **Component Organization**: Frontend components grouped by feature (e.g., `my-listings/`, `calculators/`, `layout/`).
- **Context**: Shared state via `frontend/src/context/AppContext.jsx`.

## Integration Points
- **API Communication**: Frontend uses `frontend/src/utils/api.js` for backend requests.
- **Data Flow**: Property data flows from backend models/routes to frontend pages/components.
- **External Dependencies**: Vite, React, Tailwind CSS (frontend); Express, Mongoose (backend).

## Key Files & Directories
- `backend/server.js`: Main backend entry point
- `backend/routes/`: API endpoints
- `backend/models/`: Mongoose models
- `frontend/src/pages/`: Main app pages
- `frontend/src/components/`: Reusable UI components
- `frontend/src/context/`: App-wide state/context
- `frontend/src/utils/api.js`: API helper functions

## Examples
- **Add a new property**: Update backend model (`Property.js`), route (`properties.js`), and frontend page/component (`PostPropertyWizard.jsx`, `PropertiesPage.jsx`).
- **Add a premium feature**: Update backend subscription logic and frontend premium data/components.

---
_If any section is unclear or missing, please provide feedback for improvement._
