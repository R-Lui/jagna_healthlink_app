# Firebase Test User Creation Scripts

## 🐍 Python Script (Recommended)

**Use this method** - it's automated and works perfectly!

### Quick Start:

```bash
# 1. Install Firebase Admin SDK
pip3 install firebase-admin

# 2. Download service account key from Firebase Console
#    (See PYTHON_SCRIPT_SETUP.md for detailed instructions)

# 3. Run the script
python3 create_test_users.py
```

**Creates:**
- ✅ CVIF user: cvif@test.com / password123
- ✅ BHW user: bhw@test.com / password123 (Elena Dela Cruz, PIN: 1234)

**See**: `../detailed_implementation_steps/PYTHON_SCRIPT_SETUP.md` for full setup guide

---

## ❌ TypeScript Script (Doesn't Work)

The `createTestUsers.ts` script **cannot run** because it requires React Native modules that only work inside Expo.

Use the Python script instead!

---

## 📝 Manual Method (Alternative)

If you don't want to use Python, follow the manual Firebase Console guide:

See: `../detailed_implementation_steps/FIREBASE_AUTH_SETUP_GUIDE.md`

Takes about 3-5 minutes to create users manually.

---

**Recommended**: Use the Python script - it's fast, reliable, and automated! 🚀
