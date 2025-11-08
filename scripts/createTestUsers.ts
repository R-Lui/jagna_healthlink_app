/**
 * Firebase Test User Creation Script
 * Run this to create test users for development
 */

import { initializeFirebase } from '../src/services/firebase/firebase.init';
import { authService } from '../src/services/firebase/auth.service';
import { firestoreService } from '../src/services/firebase/firestore.service';
import { UserRole, SyncStatus } from '../src/models/base.types';
import { BHW, CVIFStudent } from '../src/models/user.model';

async function createTestUsers() {
  console.log('🔥 Initializing Firebase...');
  initializeFirebase();

  try {
    // Create CVIF user
    console.log('\n📝 Creating CVIF test user...');
    const cvifCredential = await authService.createUserWithEmail(
      'cvif@test.com',
      'password123'
    );
    
    const cvifUser: CVIFStudent = {
      id: cvifCredential.user.uid,
      email: 'cvif@test.com',
      role: UserRole.CVIF,
      firstName: 'CVIF',
      lastName: 'Student',
      isActive: true,
      studentId: 'CVIF001',
      course: 'Community Health',
      yearLevel: '3rd Year',
      totalBHWsManaged: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: cvifCredential.user.uid,
      syncStatus: SyncStatus.SYNCED,
    };

    await firestoreService.saveUser(cvifUser);
    console.log('✅ CVIF user created successfully!');
    console.log('   Email: cvif@test.com');
    console.log('   Password: password123');

    // Create BHW user
    console.log('\n📝 Creating BHW test user...');
    const bhwCredential = await authService.createUserWithEmail(
      'bhw@test.com',
      'password123'
    );

    const bhwUser: BHW = {
      id: bhwCredential.user.uid,
      email: 'bhw@test.com',
      role: UserRole.BHW,
      firstName: 'Elena',
      lastName: 'Dela Cruz',
      barangay: 'Napo',
      purok: '1',
      pin: '1234',
      phoneNumber: '09171234567',
      isActive: true,
      totalPatientsRegistered: 0,
      totalEncountersRecorded: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: cvifCredential.user.uid,
      syncStatus: SyncStatus.SYNCED,
    };

    await firestoreService.saveUser(bhwUser);
    console.log('✅ BHW user created successfully!');
    console.log('   Email: bhw@test.com');
    console.log('   Password: password123');
    console.log('   PIN: 1234');

    console.log('\n🎉 All test users created successfully!');
    console.log('\n📱 You can now sign in with these credentials:');
    console.log('   CVIF: cvif@test.com / password123');
    console.log('   BHW:  bhw@test.com / password123 (or PIN: 1234)');

  } catch (error: any) {
    if (error.message?.includes('email-already-in-use')) {
      console.log('\n⚠️  Users already exist. Skipping creation.');
      console.log('   CVIF: cvif@test.com / password123');
      console.log('   BHW:  bhw@test.com / password123 (or PIN: 1234)');
    } else {
      console.error('\n❌ Error creating test users:', error.message || error);
    }
  }

  process.exit(0);
}

// Run the script
createTestUsers();
