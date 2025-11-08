# Jagna HealthLink - Mobile App

A comprehensive, offline-first mobile health monitoring system for Barangay Health Workers (BHWs) in Jagna, Bohol, Philippines. Built with React Native and Expo, this application enables community health monitoring through blood pressure tracking and patient management.

## 🎯 Project Status: **Production Ready** ✅

All 24 implementation steps completed (100%)

## Tech Stack
- **Framework:** React Native + Expo SDK 54
- **Language:** TypeScript 5.9
- **Backend:** Firebase (Authentication, Firestore, Storage)
- **Storage:** AsyncStorage (offline-first architecture)
- **Navigation:** React Navigation 7.x (Native Stack)
- **Localization:** i18next (English/Visayan)
- **Date Handling:** date-fns
- **Forms:** React Hook Form

## 🚀 Getting Started

### Prerequisites
- **Node.js:** 20.x or higher
- **npm:** 10.x or higher
- **Expo CLI:** Latest version
- **Expo Go App:** Installed on iOS/Android device
- **Firebase Account:** With project configured
- **Git:** For version control

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/R-Lui/jagna_healthlink_app.git
cd jagna_healthlink_app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
# Copy the template
cp .env.template .env

# Edit .env with your Firebase credentials
# Get these from Firebase Console > Project Settings > Your apps
```

Required environment variables:
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

4. **Start the development server:**
```bash
npm start
```

5. **Run on device:**
- Scan the QR code with Expo Go app
- Or press `i` for iOS simulator, `a` for Android emulator

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components (EmailPasswordLogin, PinLogin)
│   ├── bhw/            # BHW-specific components (PatientListItem, EncounterListItem)
│   ├── cvif/           # CVIF-specific components (BHWListItem)
│   ├── forms/          # Form components (FormInput, FormPicker, BPInput)
│   ├── common/         # Shared common components (SearchBar, EmptyState, SyncButton)
│   └── settings/       # Settings components (LanguageSwitcher)
├── screens/            # Screen components
│   ├── auth/           # Authentication screens (Login, RoleSelection)
│   ├── bhw/            # BHW screens (Dashboard, PatientList, Profile, Recording)
│   ├── cvif/           # CVIF screens (Dashboard, BHWManagement, BulkOnboarding)
│   └── shared/         # Shared screens (Settings)
├── services/           # Business logic and API services
│   ├── firebase/       # Firebase integration (auth, firestore)
│   ├── storage/        # Local storage with AsyncStorage
│   └── sync/           # Data synchronization service
├── models/             # TypeScript interfaces and data models
│   ├── patient.model.ts    # Patient data structure
│   ├── encounter.model.ts  # Blood pressure encounter structure
│   ├── user.model.ts       # User and BHW account structure
│   └── sync.model.ts       # Sync queue structure
├── navigation/         # Navigation configuration
│   ├── RootNavigator.tsx   # Root navigation setup
│   ├── BHWNavigator.tsx    # BHW tab navigation
│   └── CVIFNavigator.tsx   # CVIF stack navigation
├── context/            # React Context providers
│   └── AuthContext.tsx     # Authentication state management
├── hooks/              # Custom React hooks
│   └── useStorage.ts       # Local storage hook
├── localization/       # Internationalization
│   ├── i18n.ts            # i18next configuration
│   └── translations/      # Translation files (en.json, ceb.json)
├── utils/              # Helper functions
│   ├── bpCalculator.ts    # BP category calculation (AHA guidelines)
│   ├── upiGenerator.ts    # UPI generation logic
│   ├── constants.ts       # App-wide constants (Puroks, barangays)
│   ├── patient.utils.ts   # Patient data helpers
│   └── encounter.utils.ts # Encounter helpers
└── types/              # TypeScript type definitions
    └── navigation.types.ts # Navigation parameter types
```

## 📜 Available Scripts

- `npm start` - Start Expo development server with QR code
- `npm run ios` - Start on iOS simulator (requires Xcode)
- `npm run android` - Start on Android emulator (requires Android Studio)
- `npm run web` - Start web version in browser
- `npm run create-test-users` - Create test user accounts in Firebase

### Test User Creation

The project includes a script to create test users for development and testing:

```bash
npm run create-test-users
```

This creates:
- BHW accounts for different Puroks
- CVIF administrator accounts
- Test patients with sample data

## ✨ Key Features

### For Barangay Health Workers (BHWs)
- **📋 Patient Dashboard**
  - Complete patient list with real-time search
  - Filter by Purok (community zone)
  - Quick access to patient profiles
  - Offline-first operation

- **👤 Patient Registration**
  - 13-character UPI (Unique Patient Identifier) generation
  - Comprehensive demographic data collection
  - Form validation and error handling
  - Automatic sync when online

- **💉 Blood Pressure Monitoring**
  - Easy BP input with validation
  - Automatic AHA category calculation (Normal, Elevated, Stage 1, Stage 2, Hypertensive Crisis)
  - Encounter history tracking
  - Visual BP category display

- **📱 Patient Profile**
  - Complete patient information
  - Medical history overview
  - Encounter timeline
  - Edit and update capabilities

- **🔄 Data Synchronization**
  - Automatic bi-directional sync
  - Conflict resolution
  - Offline queue management
  - Sync status indicators

### For CVIF (Community Volunteers in Focus)
- **👥 BHW Account Management**
  - Create and manage BHW accounts
  - Assign Purok assignments
  - Monitor BHW activity
  - Bulk account creation

- **📊 Sync Monitoring**
  - Real-time sync status
  - Last sync timestamps
  - Pending operations tracking

### General Features
- **🌐 Localization**
  - Full English and Visayan (Cebuano) support
  - 200+ translated strings
  - Dynamic language switching
  - Locale-aware date formatting

- **🔐 Authentication**
  - Email/Password login
  - 6-digit PIN support for quick access
  - Role-based routing (BHW/CVIF)
  - Secure session management

- **📴 Offline Support**
  - Full app functionality without internet
  - Local data persistence with AsyncStorage
  - Automatic sync when connection restored
  - Optimistic UI updates

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- ✅ Email/Password login
- ✅ PIN login (6 digits)
- ✅ Role-based routing
- ✅ Session persistence
- ✅ Logout functionality

**BHW Features:**
- ✅ Patient list display
- ✅ Search patients by name/UPI
- ✅ Filter by Purok
- ✅ Patient registration
- ✅ UPI generation
- ✅ Patient profile view
- ✅ BP recording
- ✅ Encounter history

**CVIF Features:**
- ✅ BHW account creation
- ✅ BHW list display
- ✅ Purok assignment
- ✅ Account status management

**Offline Functionality:**
- ✅ Works without internet
- ✅ Data persists locally
- ✅ Sync queue management
- ✅ Auto-sync on reconnection

**Localization:**
- ✅ English translation complete
- ✅ Visayan translation complete
- ✅ Language switching
- ✅ Date format localization

### Test Users

Use the test user creation script to generate test accounts:
```bash
npm run create-test-users
```

Example test credentials:
- **BHW:** bhw-purok1@test.com / password123
- **CVIF:** cvif-admin@test.com / password123

## 📈 Implementation Status

### ✅ Completed Features (100%)

#### Phase 1: Foundation
- [x] Development environment setup
- [x] Firebase project configuration  
- [x] Mobile app initialization
- [x] TypeScript configuration

#### Phase 2: Core Infrastructure  
- [x] Navigation structure (Tab + Stack)
- [x] Data models and types
- [x] Local storage service
- [x] Firebase integration

#### Phase 3: Mobile Features
- [x] Authentication system
- [x] BHW patient dashboard
- [x] Patient registration
- [x] Patient profile view
- [x] BP encounter recording
- [x] Data synchronization
- [x] CVIF BHW management
- [x] Localization (EN/CEB)

#### Phase 4: Polish & Production
- [x] Error handling
- [x] Loading states
- [x] Empty states
- [x] Form validation
- [x] Offline support
- [x] Security rules
- [x] Documentation

## 🔧 Configuration

### Firebase Setup

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com
   - Create a new project or use existing
   - Add an iOS and/or Android app

2. **Register App:**
   - iOS Bundle ID: `com.jagnahealthlink.app`
   - Android Package: `com.jagnahealthlink.app`
   - Download config files (optional for Expo)

3. **Enable Authentication:**
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - No email verification required for BHWs

4. **Create Firestore Database:**
   - Go to Firestore Database
   - Create database in production mode
   - Choose appropriate region (asia-southeast1 recommended)

5. **Set Up Collections:**
   Required Firestore collections:
   - `users` - User accounts (BHW and CVIF)
   - `patients` - Patient records
   - `encounters` - Blood pressure encounters
   - `syncQueue` - Offline sync queue

6. **Configure Security Rules:**
   - Deploy Firestore security rules from `firestore.rules`
   - Ensures role-based access control
   - Validates data structure

7. **Get Configuration:**
   - Go to Project Settings > Your apps
   - Copy Firebase config values
   - Add to `.env` file

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Note:** All variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app.

## 🏗️ Architecture

### Offline-First Design
- All data operations work without internet connection
- Local storage using AsyncStorage for persistence
- Sync queue for pending operations
- Automatic sync when connection restored
- Optimistic UI updates for better UX

### Data Flow
1. **User Action** → Component interaction
2. **Local Storage** → Immediate data persistence
3. **Sync Queue** → Operation queued for sync
4. **Firebase Sync** → When online, sync to cloud
5. **UI Update** → Real-time reflection of changes

### Authentication Flow
1. User logs in with email/password or PIN
2. Firebase Authentication validates credentials
3. User role retrieved from Firestore
4. Navigation based on role (BHW/CVIF)
5. Session persisted locally

### Blood Pressure Calculation
Uses American Heart Association (AHA) guidelines:
- **Normal:** < 120 and < 80
- **Elevated:** 120-129 and < 80
- **Stage 1 Hypertension:** 130-139 or 80-89
- **Stage 2 Hypertension:** ≥ 140 or ≥ 90
- **Hypertensive Crisis:** > 180 or > 120

## 📊 Data Models

### Patient Model
```typescript
{
  id: string;              // Auto-generated
  upi: string;             // 13-character unique identifier
  firstName: string;
  middleName?: string;
  lastName: string;
  birthDate: Date;
  sex: 'male' | 'female';
  purok: string;           // Community zone assignment
  barangay: string;
  municipality: string;
  province: string;
  createdBy: string;       // BHW user ID
  createdAt: Date;
  updatedAt: Date;
}
```

### Encounter Model
```typescript
{
  id: string;              // Auto-generated
  patientId: string;       // Reference to patient
  patientUPI: string;      // For offline lookup
  systolic: number;        // mmHg
  diastolic: number;       // mmHg
  bpCategory: string;      // AHA category
  encounterDate: Date;
  recordedBy: string;      // BHW user ID
  notes?: string;
  createdAt: Date;
}
```

### User Model
```typescript
{
  id: string;              // Firebase Auth UID
  email: string;
  role: 'bhw' | 'cvif';
  firstName: string;
  lastName: string;
  purokAssignment?: string[]; // For BHWs
  pin?: string;            // 6-digit PIN hash
  isActive: boolean;
  createdAt: Date;
}
```

## 🐛 Troubleshooting

### Common Issues

#### Module Resolution Errors
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules
npm install
npm start -- --clear
```

#### App Won't Load on Device
- Ensure both computer and device are on the same WiFi network
- Try tunnel mode if on restricted network:
  ```bash
  npm start -- --tunnel
  ```
- Restart the Expo Go app
- Check if development server is running

#### Firebase Connection Issues
- Verify `.env` file has correct Firebase credentials
- Check Firebase project is active and not suspended
- Ensure Firestore database is created
- Verify Authentication is enabled

#### TypeScript Path Alias Errors
- Restart TypeScript server in VS Code:
  - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
  - Select "TypeScript: Restart TS Server"
- Check `tsconfig.json` paths are configured correctly

#### Sync Not Working
- Check device has internet connection
- Verify Firebase credentials are correct
- Check Firestore security rules allow read/write
- Review sync queue in AsyncStorage

#### Build Errors
```bash
# Clear Expo cache
expo start -c

# Clear Metro bundler cache
npx react-native start --reset-cache

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

- Keep AsyncStorage data under 6MB for optimal performance
- Implement pagination for large patient lists
- Use memo and useCallback for expensive operations
- Optimize image sizes in assets

## 🚀 Deployment

### Production Build

#### iOS Build (EAS Build)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios
```

#### Android Build (EAS Build)
```bash
# Build for Android
eas build --platform android
```

### App Distribution

- **TestFlight (iOS):** For beta testing
- **Google Play Internal Testing (Android):** For beta testing
- **Expo Go:** For development testing only

### Environment Configuration

Create separate Firebase projects for:
- **Development:** Testing and development
- **Staging:** Pre-production testing  
- **Production:** Live deployment

Use different `.env` files for each environment.

## 🔐 Security Considerations

- Firebase Authentication handles secure user sessions
- Firestore security rules enforce role-based access
- Sensitive data encrypted in transit (HTTPS)
- Local storage secured by device OS
- No API keys exposed in client code (use Expo SecureStore for production)
- PIN stored as hashed value (bcrypt recommended)

## 📱 Related Projects

- **Web Dashboard:** `jagna_healthlink_web` - React web application for PHILOS dashboard
- **Documentation:** `detailed_implementation_steps/` - Comprehensive implementation guides
- **Mock Data Scripts:** `mock_data_scripts/` - Data generation utilities

## 📚 Documentation

- **Implementation Steps:** See `../detailed_implementation_steps/` for detailed guides
- **API Documentation:** Firebase SDK documentation at firebase.google.com/docs
- **Expo Documentation:** docs.expo.dev
- **React Navigation:** reactnavigation.org

### Key Documentation Files
- `PROJECT_COMPLETE.md` - Complete project overview
- `STEP_*_COMPLETE.md` - Individual step completion summaries
- `FIREBASE_AUTH_SETUP_GUIDE.md` - Firebase authentication setup
- `PYTHON_SCRIPT_SETUP.md` - Test data generation guide

## 🤝 Contributing

This is a case competition project for SIGHT 2025. Contributions should follow:

1. **Code Style:**
   - Follow TypeScript best practices
   - Use functional components with hooks
   - Implement proper error handling
   - Add comments for complex logic

2. **Commits:**
   - Use descriptive commit messages
   - Follow conventional commits format
   - Reference issue numbers when applicable

3. **Testing:**
   - Test on both iOS and Android
   - Verify offline functionality
   - Check both English and Visayan translations
   - Validate all user roles (BHW/CVIF)

## 📄 License

This project is developed for the SIGHT 2025 Case Competition.

## 👥 Authors

- **Team:** SIGHT 2025 Case Competition Participants
- **Repository:** [github.com/R-Lui/jagna_healthlink_app](https://github.com/R-Lui/jagna_healthlink_app)

## 🙏 Acknowledgments

- **Jagna, Bohol Community:** For the opportunity to address real healthcare needs
- **Barangay Health Workers:** For their dedication to community health
- **SIGHT 2025:** For organizing the case competition
- **React Native & Expo Teams:** For excellent mobile development tools
- **Firebase:** For robust backend infrastructure

## 📞 Support & Contact

For questions about implementation or deployment:
- Check documentation in `detailed_implementation_steps/`
- Review troubleshooting section above
- Consult Firebase and Expo documentation

---

**Project Status:** ✅ Production Ready (All 24 Steps Complete)

**Last Updated:** November 2025

**Version:** 1.0.0
