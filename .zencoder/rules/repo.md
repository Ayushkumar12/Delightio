# Delightio Repository Notes

- **framework**: React (Create React App)
- **backend**: Express server with Firebase Realtime Database
- **key frontend pages**:
  - `src/page/Home.jsx`: customer ordering UI
  - `src/page/Admin.jsx`: menu management
  - `src/page/Order.jsx`: order status
- **backend entry**: `src/back/server.js` (runs on port 3001)
- **styles**: Tailwind classes + custom CSS under `src/asserts/style`
- **assets**: stored under `src/asserts` and Firebase Storage via admin panel
- **authentication**: handled in `src/Authentication`
- **tests**: Jest (default CRA setup)