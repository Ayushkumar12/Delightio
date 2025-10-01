# Delightio

Delightio is a web-based ordering experience for in-restaurant diners. It combines a Firebase-backed Express API with a React front end so guests can browse dishes, build a cart, and send their order directly to staff.

## Features

- **Rich menu browsing**: Displays dishes with imagery, pricing, and responsive layouts.
- **Interactive cart**: Add/remove dishes, adjust quantities, and track order totals with tax estimates.
- **Checkout workflow**: Collects customer name and table details before pushing the order to Firebase.
- **Admin portal**: Protected interface for staff to upload new dishes (including images stored in Firebase Storage) and manage current offerings.
- **Server logging**: API activity streams into JSONL logs for basic auditing and troubleshooting.

## Tech Stack

### Frontend
- React 18 (Create React App foundation)
- Tailwind-esque utility classes + custom CSS modules
- React Router for client-side navigation

### Backend
- Node.js with Express 4
- Firebase Admin SDK for Realtime Database access
- CORS + JSON middleware

### Data & Services
- Firebase Realtime Database (menu, orders, users)
- Firebase Storage (dish photography)
- Firebase Authentication (admin access)

## Prerequisites

- Node.js 18+
- npm 9+
- A Firebase project with Realtime Database, Storage, and Authentication enabled

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-fork-or-clone-url>
   cd Delightio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - The current Firebase configuration is embedded in `src/page/Home.jsx`, `src/page/Admin.jsx`, and `src/back/server.js`.
   - For production, move these secrets into environment variables and load them at runtime.

4. **Start the backend API**
   ```bash
   node src/back/server.js
   ```
   The API listens on `http://localhost:3001`.

5. **Start the React app**
   ```bash
   npm start
   ```
   The frontend runs on `http://localhost:3000` and proxies requests to the API.

## Project Structure

```
Delightio/
├── public/                  # Static assets and fallback images
├── src/
│   ├── Authentication/      # Auth context, protected routes
│   ├── asserts/             # Local imagery and styles
│   ├── back/
│   │   ├── logs/            # JSONL server logs
│   │   └── server.js        # Express + Firebase API
│   ├── comp/                # Shared UI components (Navbar, Footer)
│   ├── page/                # Route-level views (Home, Admin, Order)
│   ├── App.js               # Client routing
│   └── index.js             # React entry point
├── package.json
└── README.md
```

## Usage Notes

- **Customer flow**: Guests land on `/`, explore dishes, add them to the cart, enter name/table, and submit the order. Orders are persisted under `orders/` in Firebase.
- **Admin flow**: Authorized users visit `/admin`, upload dish details, and remove outdated items. Images are uploaded to Firebase Storage; the resulting download URL is stored with menu metadata.
- **Logs**: Every API operation appends a JSON line to `src/back/logs/server.log`.

## Available Scripts

- `npm start` – Runs the CRA development server.
- `npm test` – Launches the CRA test runner in watch mode.
- `npm run build` – Produces a production build in `build/`.
- `node src/back/server.js` – Boots the Express + Firebase backend.

## Deployment Checklist

- Replace hardcoded Firebase config with environment variables.
- Serve the React build via a production server (e.g., Vercel, Netlify) or behind the Express API.
- Enable HTTPS and configure CORS allowed origins to your deployed domain.
- Monitor `server.log` or pipe logs to a centralized solution.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-update`).
3. Commit changes with clear messages.
4. Verify lint/test suites (`npm test`).
5. Open a pull request summarizing the change.

## License

This project is currently private and not licensed for redistribution.