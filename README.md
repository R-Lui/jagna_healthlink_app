# Jagna HealthLink - Mobile App

React Native mobile application built with Expo for Barangay Health Workers in Jagna, Bohol.

## Tech Stack
- React Native + Expo SDK 54
- TypeScript
- Firebase (Auth, Firestore, Storage)
- AsyncStorage (local data)
- React Navigation
- i18next (localization)

## Getting Started

### Prerequisites
- Node.js 20.x
- Expo CLI
- Expo Go app on iOS device
- Firebase project configured

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
# Edit .env with your Firebase credentials
# Get credentials from Firebase Console > Project Settings
```

3. Start development server:
```bash
npm start
```

4. Scan QR code with Expo Go on your iOS device

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── common/     # Shared components
│   ├── bhw/        # BHW-specific components
│   ├── cvif/       # CVIF-specific components
│   └── shared/     # Common shared components
├── screens/        # Screen components
│   ├── auth/       # Authentication screens
│   ├── bhw/        # BHW screens
│   └── cvif/       # CVIF screens
├── services/       # Business logic and API services
│   ├── firebase/   # Firebase integration
│   ├── storage/    # Local storage
│   └── sync/       # Sync services
├── models/         # TypeScript interfaces and types
├── utils/          # Helper functions
├── context/        # React Context providers
├── hooks/          # Custom React hooks
└── locales/        # i18n translation files
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Start on iOS simulator
- `npm run android` - Start on Android emulator
- `npm run web` - Start web version

## Features

### BHW Features
- Patient dashboard with search
- Patient registration with UPI generation
- Blood pressure recording
- Offline-first operation
- Automatic sync when online

### CVIF Features
- BHW account management
- Create and manage BHW accounts
- Bulk data onboarding
- Sync status monitoring

## Development Status

**Current Phase:** Initial Setup Complete ✅
- [x] Expo app initialized
- [x] Dependencies installed
- [x] Project structure created
- [x] TypeScript configured
- [x] Firebase config ready
- [ ] Navigation structure (next)
- [ ] Data models (pending)
- [ ] Authentication system (pending)

## Configuration

### Firebase Setup
1. Create Firebase project at https://console.firebase.google.com
2. Register iOS app with bundle ID: `com.jagnahealthlink.app`
3. Copy Firebase config values to `.env` file
4. Enable Authentication (Email/Password)
5. Create Firestore database

### Environment Variables
Required in `.env`:
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

## Development Notes

- Using Expo Go for iOS development
- AsyncStorage for local data (development)
- Will migrate to SQLite for Android production
- Offline-first architecture
- Multi-language support (English/Visayan)

## Next Steps

1. **Step 04:** Setup navigation structure
2. **Step 05:** Implement data models
3. **Step 06:** Setup local storage
4. **Step 07:** Integrate Firebase
5. **Step 08:** Build authentication system

## Troubleshooting

### Module resolution errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start -- --clear
```

### App won't load on device
- Ensure both devices on same WiFi
- Try tunnel mode: `npm start -- --tunnel`
- Restart Expo Go app

### TypeScript path alias errors
- Restart TypeScript server in your editor
- VS Code: Cmd+Shift+P > "TypeScript: Restart TS Server"

## Support

For implementation steps, see `../detailed_implementation_steps/`
