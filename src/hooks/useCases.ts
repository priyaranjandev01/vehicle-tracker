import { useState, useEffect, useCallback } from 'react';
import { Case, CaseStage } from '@/types/case';

const STORAGE_KEY = 'servicedesk-cases';

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cases from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const casesWithDates = parsed.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        notes: c.notes.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })),
      }));
      setCases(casesWithDates);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever cases change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    }
  }, [cases, isLoading]);

  const addCase = useCallback((newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'notes'>) => {
    const caseToAdd: Case = {
      ...newCase,
      id: crypto.randomUUID(),
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCases(prev => [...prev, caseToAdd]);
    return caseToAdd;
  }, []);

  const updateCase = useCallback((id: string, updates: Partial<Case>) => {
    setCases(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date() }
          : c
      )
    );
  }, []);

  const moveCase = useCallback((id: string, newStage: CaseStage) => {
    updateCase(id, { stage: newStage });
  }, [updateCase]);

  const addNote = useCallback((caseId: string, text: string) => {
    setCases(prev =>
      prev.map(c =>
        c.id === caseId
          ? {
              ...c,
              notes: [
                ...c.notes,
                { id: crypto.randomUUID(), text, timestamp: new Date() },
              ],
              updatedAt: new Date(),
            }
          : c
      )
    );
  }, []);

  const deleteCase = useCallback((id: string) => {
    setCases(prev => prev.filter(c => c.id !== id));
  }, []);

  const getCasesByStage = useCallback(
    (stage: CaseStage) => cases.filter(c => c.stage === stage),
    [cases]
  );

  return {
    cases,
    isLoading,
    addCase,
    updateCase,
    moveCase,
    addNote,
    deleteCase,
    getCasesByStage,
  };
}
