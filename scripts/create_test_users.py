#!/usr/bin/env python3
"""
Firebase Test User Creation Script
Creates BHW and CVIF test users in Firebase
"""

import firebase_admin
from firebase_admin import credentials, auth, firestore
from datetime import datetime
import sys
import os

def create_test_users():
    """Create test users for Jagna HealthLink"""
    
    print("🔥 Initializing Firebase Admin SDK...")
    
    # Initialize Firebase Admin SDK
    # You need to download your service account key from:
    # Firebase Console -> Project Settings -> Service Accounts -> Generate New Private Key
    try:
        # Try to find the service account key
        service_account_path = os.path.join(os.path.dirname(__file__), 'jagna-healthlink-firebase-adminsdk-fbsvc-1e13dc812e.json')
        
        if not os.path.exists(service_account_path):
            print("\n❌ Error: jagna-healthlink-firebase-adminsdk-fbsvc-1e13dc812e.json not found!")
            print("\n📝 To fix this:")
            print("1. Go to Firebase Console: https://console.firebase.google.com")
            print("2. Select your project")
            print("3. Click Settings (⚙️) → Project Settings")
            print("4. Go to 'Service Accounts' tab")
            print("5. Click 'Generate New Private Key'")
            print(f"6. Save the file as: {service_account_path}")
            print("\n7. Run this script again")
            sys.exit(1)
        
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        print("✅ Firebase initialized successfully!\n")
        
    except Exception as e:
        print(f"❌ Error initializing Firebase: {e}")
        sys.exit(1)
    
    # Create CVIF user
    try:
        print("📝 Creating CVIF test user...")
        
        # Create auth user
        try:
            cvif_user = auth.create_user(
                email='cvif@test.com',
                password='password123',
                display_name='CVIF Student'
            )
            print(f"   ✅ Auth user created: {cvif_user.uid}")
        except auth.EmailAlreadyExistsError:
            cvif_user = auth.get_user_by_email('cvif@test.com')
            print(f"   ℹ️  Auth user already exists: {cvif_user.uid}")
        
        # Create Firestore document
        cvif_data = {
            'id': cvif_user.uid,
            'email': 'cvif@test.com',
            'role': 'CVIF',
            'firstName': 'CVIF',
            'lastName': 'Student',
            'isActive': True,
            'studentId': 'CVIF001',
            'course': 'Community Health',
            'yearLevel': '3rd Year',
            'totalBHWsManaged': 0,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
            'createdBy': cvif_user.uid,
            'syncStatus': 'synced'
        }
        
        db.collection('users').document(cvif_user.uid).set(cvif_data)
        print("   ✅ Firestore document created")
        print("   📧 Email: cvif@test.com")
        print("   🔑 Password: password123\n")
        
    except Exception as e:
        print(f"   ❌ Error creating CVIF user: {e}\n")
    
    # Create BHW user (Elena)
    try:
        print("📝 Creating BHW test user (Elena)...")
        
        # Create auth user
        try:
            bhw_user = auth.create_user(
                email='bhw@test.com',
                password='password123',
                display_name='Elena Dela Cruz'
            )
            print(f"   ✅ Auth user created: {bhw_user.uid}")
        except auth.EmailAlreadyExistsError:
            bhw_user = auth.get_user_by_email('bhw@test.com')
            print(f"   ℹ️  Auth user already exists: {bhw_user.uid}")
            # Update display name
            auth.update_user(bhw_user.uid, display_name='Elena Dela Cruz')
        
        # Create/Update Firestore document
        bhw_data = {
            'id': bhw_user.uid,
            'email': 'bhw@test.com',
            'role': 'BHW',
            'firstName': 'Elena',
            'lastName': 'Dela Cruz',
            'barangay': 'Napo',
            'purok': '1',
            'pin': '1234',
            'phoneNumber': '09171234567',
            'isActive': True,
            'totalPatientsRegistered': 0,
            'totalEncountersRecorded': 0,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
            'createdBy': cvif_user.uid if 'cvif_user' in locals() else bhw_user.uid,
            'syncStatus': 'synced'
        }
        
        db.collection('users').document(bhw_user.uid).set(bhw_data, merge=True)
        print("   ✅ Firestore document created/updated")
        print("   📧 Email: bhw@test.com")
        print("   🔑 Password: password123")
        print("   📱 PIN: 1234\n")
        
    except Exception as e:
        print(f"   ❌ Error creating BHW user: {e}\n")
    
    print("🎉 Test user creation complete!\n")
    print("📱 You can now sign in with:")
    print("   CVIF: cvif@test.com / password123")
    print("   BHW:  bhw@test.com / password123 (or PIN: 1234)")
    print("\n✅ Elena Dela Cruz (BHW) is ready to use!")

if __name__ == '__main__':
    create_test_users()
