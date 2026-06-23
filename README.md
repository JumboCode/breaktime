# Breaktime

A Progressive Web App (PWA) for scheduling and messaging between youth (YA) users and staff at [Breaktime](https://www.breaktime.org). Built by JumboCode 2025–2026.

**Technical Lead:** Yoda Ermias | **Project Manager:** Luis Suarez | **Designer:** Allen Wang

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Clerk |
| Backend | Node.js, Express 5, MongoDB, Clerk |
| Auth | Clerk (permission levels stored in user metadata) |
| Deployment | Vercel (both sides have `vercel.json`) |

---

## Project Structure

```
breaktime/
├── backend/          Express API
├── frontend/
│   └── breaktime/    React + Vite app
└── package.json      Root monorepo scripts
```

---

## Backend

```
backend/src/
├── app.js            Express app setup (CORS, routes)
├── server.js         Entry point
├── routes/           One file per entity
├── schemas/          Joi validation schemas
└── utils/
    ├── mongodb.js    Singleton DB connection
    ├── clerk.js      Clerk client init
    └── api.js        Shared API helpers
```

### API Routes

| Route | Description |
|---|---|
| `/user` | Create and fetch youth (YA) accounts |
| `/staff` | Create staff accounts |
| `/admin` | Approve/deny pending accounts, list all users |
| `/booking` | CRUD for bookings and booking history |
| `/service` | Service definitions and availability |
| `/serviceExtension` | Extended service configuration |
| `/notification` | Inbox, message threads, mark-read |

### Databases (MongoDB)

| Database | Purpose |
|---|---|
| `requests` | Pending account and booking extension approvals |
| `services` | Service definitions and bookings |
| `notifications` | Inbox messages and notifications |

---

## Frontend

```
frontend/breaktime/src/
├── App.jsx               Router + Clerk provider + ModalProvider
├── pages/                Full page components (desktop)
│   └── mobile/           Mobile-optimized page variants
├── components/           Reusable UI (NavBar, Calendar, Inbox, etc.)
│   ├── popups/           Modal dialogs (staff booking, YA booking, messaging)
│   └── mobile/           Mobile-specific components (tabs, bottom sheets)
└── utils/
    ├── ProtectedRoute.jsx    Auth guard (checks Clerk + permission level)
    ├── general.js            API call helpers
    └── errorMessages.js      Centralized error text
```

### Role-Based Routing

After login, `HomeChooser.jsx` reads `user.publicMetadata.permission` from Clerk and routes accordingly:

| Permission | Role | Destination |
|---|---|---|
| `0` | Pending | Blocked / redirected |
| `1` | Youth (YA) | `YouthLandingPage` (desktop) or `YouthLandingPageMobile` (mobile) |
| `2` | Staff | `HomePage` (calendar, booking management, user table, inbox) |

Mobile is detected via user-agent string or window width < 1025px.

---

## Getting Started

**Prerequisites:** Node.js, a MongoDB Atlas URI, and Clerk API keys.

**1. Install dependencies**
```bash
npm run install
```

**2. Set up environment variables**

`backend/.env`:
```
MONGODB_URI=
CLERK_SECRET_KEY=
```

`frontend/breaktime/.env`:
```
VITE_BASE_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=
```

**3. Run in development mode**
```bash
npm run dev   # starts either the backend or frontend depending on the current directory
```

You can also run them separately:
```bash
npm run backend    # Express on port 3000
npm run frontend   # Vite dev server
```

---

## Deployment

Both `backend/` and `frontend/breaktime/` have `vercel.json` configs. Deploy each as a separate Vercel project. After deploying the backend, update `VITE_BASE_URL` in the frontend environment to point at the live backend URL.

The current active link for the application is https://breaktime-lemon.vercel.app/ 
