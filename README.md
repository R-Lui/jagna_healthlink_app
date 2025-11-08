# 🏥 Jagna HealthLink - Mobile App

[![Expo](https://img.shields.io/badge/Expo-54-000020.svg?logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb.svg?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.5-orange.svg?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A comprehensive, offline-first mobile health monitoring system for Barangay Health Workers (BHWs) in Jagna, Bohol, Philippines. This React Native application empowers community health workers to track hypertension, manage patient records, and improve healthcare outcomes in rural communities.

## 🎯 Project Status

**Production Ready** ✅ - All 24 implementation steps completed (100%)

## ✨ Features

### 👥 Dual User Roles

#### Barangay Health Worker (BHW)
- **Patient Management:** Register new patients with unique Patient IDs (UPI)
- **Blood Pressure Monitoring:** Record BP readings with automatic risk classification
- **Offline-First:** Work without internet connectivity, sync when online
- **Patient Profiles:** Comprehensive medical history and encounter timeline
- **Dashboard:** Quick overview of recent patients and encounters
- **Search & Filter:** Find patients by name, UPI, barangay, or risk level

#### CVIF Coordinator (PHILOS)
- **BHW Management:** Create and manage BHW accounts
- **Bulk Onboarding:** Efficiently onboard multiple BHWs at once
- **Sync Monitoring:** Track data synchronization across all BHWs
- **Analytics Dashboard:** Monitor program metrics and coverage
- **Multi-Barangay Management:** Oversee health workers across multiple barangays

### 🩺 Health Monitoring

- **Automated Risk Assessment:** BP readings automatically classified (Normal, Elevated, Stage 1, Stage 2)
- **Risk Scoring:** Multi-factor risk calculation based on BP, age, smoking, diabetes, and family history
- **Encounter History:** Complete timeline of all patient visits
- **Visual BP Tracking:** Color-coded BP categories for quick assessment
- **Medical History:** Track chronic conditions, medications, and health events

### � Data Management

- **Offline-First Architecture:** Full functionality without internet connection
- **Automatic Sync:** Seamlessly sync data when connectivity is available
- **Conflict Resolution:** Smart handling of concurrent data modifications
- **Local Storage:** AsyncStorage for reliable local data persistence
- **Firebase Integration:** Cloud backup and multi-device synchronization

### 🌍 Localization

- **Bilingual Support:** English and Visayan (Cebuano) languages
- **Easy Language Switching:** Toggle languages in Settings
- **Culturally Appropriate:** Interface designed for local context

### 🔒 Security

- **Firebase Authentication:** Secure email/password and PIN-based login
- **Role-Based Access:** Separate flows for BHW and CVIF coordinators
- **Data Encryption:** Firebase security rules protect sensitive health data
- **PIN Protection:** Quick access with 4-digit PIN for frequent users

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React Native + Expo SDK 54 |
| **Language** | TypeScript 5.9 |
| **Backend** | Firebase (Authentication, Firestore, Storage) |
| **Local Storage** | AsyncStorage (offline-first) |
| **Navigation** | React Navigation 7.x (Native Stack) |
| **State Management** | React Context API |
| **Forms** | React Hook Form |
| **Localization** | i18next + react-i18next |
| **Date/Time** | date-fns |
| **Network** | NetInfo for connectivity detection |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** 20.x or higher ([Download](https://nodejs.org/))
- **npm:** 10.x or higher (comes with Node.js)
- **Expo CLI:** Latest version (`npm install -g expo-cli`)
- **Expo Go App:** On your iOS/Android device ([iOS](https://apps.apple.com/app/apple-store/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Firebase Account:** Free tier is sufficient ([Sign up](https://console.firebase.google.com/))
- **Git:** For version control ([Download](https://git-scm.com/))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/R-Lui/jagna_healthlink_app.git
cd jagna_healthlink_app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: `jagna-healthlink`
3. **Enable Authentication:**
   - Go to Authentication > Sign-in method
   - Enable Email/Password
4. **Create Firestore Database:**
   - Go to Firestore Database
   - Create database in test mode
   - Choose region: `us-central1` (or closest to you)
5. **Enable Storage:**
   - Go to Storage
   - Get started with default settings
6. **Register iOS and Android apps:**
   - iOS Bundle ID: `com.jagnahealthlink.app`
   - Android Package: `com.jagnahealthlink.app`
   - Download config files (we'll use the web config)

### 4. Configure Environment Variables

```bash
# Copy the template
cp .env.template .env

# Edit .env with your Firebase credentials
nano .env  # or use your preferred editor
```

Add your Firebase configuration (from Firebase Console > Project Settings > Your apps):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=jagna-healthlink.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=jagna-healthlink
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=jagna-healthlink.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789...
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
```

### 5. Create Test Users (Optional)

Create test BHW and CVIF accounts for development:

```bash
cd scripts
pip install -r requirements.txt
python create_test_users.py
```

This creates:
- **BHW Account:** `bhw@test.com` / `test1234` / PIN: `1234`
- **CVIF Account:** `cvif@test.com` / `test1234` / PIN: `5678`

### 6. Start Development Server

```bash
npm start
```

### 7. Run on Your Device

**Option A: Physical Device (Recommended)**
1. Install Expo Go on your phone
2. Scan the QR code displayed in the terminal
3. App will load on your device

**Option B: Simulator**
- iOS: Press `i` (requires macOS with Xcode)
- Android: Press `a` (requires Android Studio)

**Option C: Web Preview**
- Press `w` (limited functionality)

## 📱 Using the App

### First-Time Setup

1. **Select Role:** Choose BHW or CVIF
2. **Login:** Use email/password or PIN
3. **Explore:** Navigate through the dashboard and features

### For BHWs

1. **Register Patient:**
   - Tap "Register New Patient"
   - Fill in patient information
   - System generates unique Patient ID (UPI)

2. **Record Encounter:**
   - Search for patient or scan from list
   - Enter blood pressure readings
   - System calculates risk level
   - Save encounter (works offline)

3. **View Patient Profile:**
   - Tap patient from list
   - See complete encounter history
   - View risk assessment
   - Check medical history

4. **Sync Data:**
   - Tap sync button when online
   - All offline data uploads to cloud
   - Downloads updates from other devices

### For CVIF Coordinators

1. **Create BHW Account:**
   - Go to BHW Management
   - Tap "Create New BHW"
   - Enter BHW details and assign barangay
   - Generate PIN for BHW

2. **Bulk Onboarding:**
   - Use bulk import for multiple BHWs
   - Upload CSV or enter multiple records
   - System creates all accounts at once

3. **Monitor Sync:**
   - Check sync status of all BHWs
   - View pending syncs
   - Monitor data flow

## 📁 Project Structure

```
jagna_healthlink_app/
│   ├── localization/        # i18next configuration
│   │   └── translations/   # Language files (en.json, ceb.json)
│   ├── utils/              # Helper functions
│   │   ├── bpCalculator.ts     # BP risk calculation
│   │   ├── upiGenerator.ts     # Patient ID generation
│   │   └── constants.ts        # App-wide constants
│   └── types/              # TypeScript type definitions
├── config/                 # Configuration files
│   └── firebase.config.ts  # Firebase initialization
├── scripts/                # Utility scripts
│   ├── create_test_users.py    # Create test accounts
│   └── createTestUsers.ts      # TypeScript version
├── assets/                 # Images, fonts, and static files
├── App.tsx                 # Root component
├── index.ts                # App entry point
└── package.json            # Dependencies and scripts
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Start and open on Android emulator |
| `npm run ios` | Start and open on iOS simulator |
| `npm run web` | Start web version (limited functionality) |
| `npm run create-test-users` | Create test BHW and CVIF accounts |

## 🔑 Key Concepts

### Offline-First Architecture

The app is designed to work seamlessly without internet connectivity:

1. **Local Storage:** All data is stored locally using AsyncStorage
2. **Sync Queue:** Changes are queued when offline
3. **Automatic Sync:** Data syncs to Firebase when connectivity is restored
4. **Conflict Resolution:** Last-write-wins strategy with timestamps

### Blood Pressure Classification

The app uses ACC/AHA 2017 Guidelines:

| Category | Systolic (mmHg) | Diastolic (mmHg) | Risk Level |
|----------|----------------|-----------------|------------|
| Normal | < 120 | and < 80 | Low |
| Elevated | 120-129 | and < 80 | Low-Medium |
| Stage 1 Hypertension | 130-139 | or 80-89 | Medium-High |
| Stage 2 Hypertension | ≥ 140 | or ≥ 90 | High |
| Hypertensive Crisis | > 180 | and/or > 120 | Critical |

### Risk Assessment

Multi-factor risk scoring considers:
- Current blood pressure reading
- Age (higher risk for 60+)
- Smoking status
- Diabetes diagnosis
- Family history of hypertension

Risk levels: Low, Medium, High, Critical

### Unique Patient Identifier (UPI)

Format: `YYYY-BARANGAY-XXXX`
- `YYYY`: Year of registration
- `BARANGAY`: 3-letter barangay code
- `XXXX`: Sequential 4-digit number

Example: `2025-TAB-0001` (First patient in Tabalong, 2025)

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Email/password login works
- [ ] PIN login works
- [ ] Role selection persists
- [ ] Logout clears session

**BHW Workflow:**
- [ ] Register new patient
- [ ] UPI generates correctly
- [ ] Record BP encounter
- [ ] Risk classification displays correctly
- [ ] Data saves offline
- [ ] Sync works when online

**CVIF Workflow:**
- [ ] Create BHW account
- [ ] Bulk onboarding works
- [ ] View all BHWs
- [ ] Monitor sync status

**Localization:**
- [ ] Switch between English and Visayan
- [ ] All text translates correctly
- [ ] Language persists after app restart

### Test Users

Use the provided script to create test accounts:

```bash
cd scripts
python create_test_users.py
```

**BHW Test Account:**
- Email: `bhw@test.com`
- Password: `test1234`
- PIN: `1234`
- Role: BHW
- Barangay: Tabalong

**CVIF Test Account:**
- Email: `cvif@test.com`
- Password: `test1234`
- PIN: `5678`
- Role: CVIF

## 🚢 Deployment

### Building for Production

#### iOS (App Store)

1. Configure app.json with your bundle ID
2. Build using EAS:
   ```bash
   npm install -g eas-cli
   eas build --platform ios
   ```
3. Submit to App Store

#### Android (Google Play)

1. Configure app.json with your package name
2. Build using EAS:
   ```bash
   eas build --platform android
   ```
3. Submit to Google Play

### Firebase Security Rules

Before deploying, configure Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Patients - BHWs can create and read, CVIF can read all
    match /patients/{patientId} {
      allow create: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'BHW';
      allow read: if request.auth != null;
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['BHW', 'CVIF'];
    }
    
    // Encounters - BHWs can create, all authenticated can read
    match /encounters/{encounterId} {
      allow create: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'BHW';
      allow read: if request.auth != null;
    }
    
    // BHW accounts - CVIF can manage
    match /bhws/{bhwId} {
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'CVIF';
    }
  }
}
```

## 🔒 Security Best Practices

- **Environment Variables:** Never commit `.env` file to version control
- **Firebase Rules:** Implement strict security rules before production
- **Data Validation:** Validate all inputs on both client and server
- **Authentication:** Use Firebase Auth best practices
- **PIN Security:** Store PIN hashes, not plain text
- **HTTPS Only:** All Firebase communication is encrypted

## 🌍 Localization

### Supported Languages

- **English (en):** Default language
- **Visayan/Cebuano (ceb):** Local dialect in Jagna, Bohol

### Adding New Translations

1. Add translation file: `src/localization/translations/<lang>.json`
2. Import in `src/localization/i18n.ts`
3. Add language option in `LanguageSwitcher.tsx`

Translation files use nested keys:

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "bhw": {
    "dashboard": {
      "title": "Dashboard"
    }
  }
}
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Reporting Issues

- Use GitHub Issues to report bugs
- Include steps to reproduce
- Provide screenshots if applicable
- Mention device/OS version

### Suggesting Features

- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Explain how it helps BHWs or CVIF coordinators

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly on both iOS and Android
5. Commit with clear messages: `git commit -m 'feat: add amazing feature'`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Keep components small and focused
- Add comments for complex logic
- Use meaningful variable names

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

**Jagna HealthLink Development Team**

## 🙏 Acknowledgments

- **Barangay Health Workers** of Jagna for their invaluable feedback
- **PHILOS Coordinators** for defining requirements and testing
- **Municipality of Jagna** for supporting the initiative
- **Expo Team** for the amazing development platform
- **Firebase** for reliable backend infrastructure
- **React Native Community** for excellent libraries and support

## 📞 Support & Contact

For support, questions, or feedback:
- **GitHub Issues:** [Report a bug](https://github.com/R-Lui/jagna_healthlink_app/issues)
- **Documentation:** See `detailed_implementation_steps/` folder
- **Email:** Contact the development team

## 🗺️ Roadmap

### Completed Features ✅
- ✅ User authentication (Email/Password and PIN)
- ✅ Patient registration and management
- ✅ Blood pressure recording and tracking
- ✅ Offline-first data storage
- ✅ Data synchronization with Firebase
- ✅ Risk assessment and classification
- ✅ BHW and CVIF role separation
- ✅ Bilingual support (English/Visayan)
- ✅ Search and filtering
- ✅ Bulk BHW onboarding

### Future Enhancements 🔮
- 📱 Push notifications for high-risk patients
- 📊 Advanced analytics and reporting
- 📸 Photo capture for patient records
- 🗺️ GPS tracking for home visits
- 📧 Email reports to PHILOS coordinators
- 🔔 Medication reminders
- 📈 Trend analysis and predictions
- 🌐 Integration with national health databases

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📊 Project Metrics

- **Lines of Code:** ~15,000
- **Components:** 50+
- **Screens:** 20+
- **Services:** 10+
- **Models:** 5+
- **Development Time:** 4 weeks
- **Test Coverage:** Manual testing across all features

---

**Built with ❤️ for the health and wellness of Jagna, Bohol**

*Empowering Barangay Health Workers, one patient at a time.*
