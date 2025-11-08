/**
 * Custom React Hook for Storage Operations
 * Provides easy access to storage service with React state management
 */

import { useState, useCallback } from 'react';
import { storageService } from '../services/storage/asyncstorage.service';
import { Patient, Encounter } from '../models';

export function usePatientStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePatient = useCallback(async (patient: Patient) => {
    setLoading(true);
    setError(null);
    try {
      await storageService.savePatient(patient);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save patient');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPatient = useCallback(async (patientId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await storageService.getPatient(patientId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get patient');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPatientByUpi = useCallback(async (upi: string) => {
    setLoading(true);
    setError(null);
    try {
      return await storageService.getPatientByUpi(upi);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get patient by UPI');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await storageService.getAllPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get patients');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPatients = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      return await storageService.searchPatients(searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search patients');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePatient = useCallback(async (patientId: string) => {
    setLoading(true);
    setError(null);
    try {
      await storageService.deletePatient(patientId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete patient');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    savePatient,
    getPatient,
    getPatientByUpi,
    getAllPatients,
    searchPatients,
    deletePatient,
    loading,
    error,
  };
}

export function useEncounterStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveEncounter = useCallback(async (encounter: Encounter) => {
    setLoading(true);
    setError(null);
    try {
      await storageService.saveEncounter(encounter);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save encounter');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEncounter = useCallback(async (encounterId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await storageService.getEncounter(encounterId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get encounter');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPatientEncounters = useCallback(async (patientId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await storageService.getPatientEncounters(patientId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get encounters');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEncounter = useCallback(async (encounterId: string) => {
    setLoading(true);
    setError(null);
    try {
      await storageService.deleteEncounter(encounterId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete encounter');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saveEncounter,
    getEncounter,
    getPatientEncounters,
    deleteEncounter,
    loading,
    error,
  };
}
