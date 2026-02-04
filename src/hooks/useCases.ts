import { useState, useEffect, useCallback } from 'react';
import { Case, CaseStage } from '@/types/case';
import { recompressDataUrl } from '@/lib/imageCompression';

const STORAGE_KEY = 'servicedesk-cases';

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cases from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Convert date strings back to Date objects
          const casesWithDates = parsed.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt),
            notes: (c.notes || []).map((n: any) => ({
              ...n,
              timestamp: new Date(n.timestamp),
            })),
            photos: (c.photos || []).map((p: any) => ({
              ...p,
              timestamp: new Date(p.timestamp),
            })),
          }));
          setCases(casesWithDates);
        }
      }
    } catch (error) {
      // If anything goes wrong with parsing, reset storage so the app still works
      console.error('Failed to load stored cases, clearing corrupted data.', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever cases change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    }
  }, [cases, isLoading]);

  // After load, periodically archive photos for old closed cases
  useEffect(() => {
    if (isLoading || cases.length === 0) return;

    const now = new Date().getTime();
    const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;

    const casesNeedingArchive = cases.filter(
      (c) =>
        c.stage === 'case-closed' &&
        now - c.updatedAt.getTime() > fifteenDaysMs &&
        c.photos?.some((p) => !p.archived),
    );

    if (casesNeedingArchive.length === 0) return;

    let cancelled = false;

    const runArchive = async () => {
      const updatedCases: Case[] = [];

      for (const c of cases) {
        if (
          c.stage === 'case-closed' &&
          now - c.updatedAt.getTime() > fifteenDaysMs &&
          c.photos?.some((p) => !p.archived)
        ) {
          const updatedPhotos = await Promise.all(
            c.photos.map(async (p) => {
              if (p.archived) return p;
              try {
                const archivedDataUrl = await recompressDataUrl(p.dataUrl);
                return {
                  ...p,
                  dataUrl: archivedDataUrl,
                  archived: true,
                };
              } catch {
                // If recompression fails, keep original photo
                return p;
              }
            }),
          );

          updatedCases.push({
            ...c,
            photos: updatedPhotos,
          });
        } else {
          updatedCases.push(c);
        }
      }

      if (!cancelled) {
        setCases(updatedCases);
      }
    };

    void runArchive();

    return () => {
      cancelled = true;
    };
  }, [cases, isLoading]);

  const addCase = useCallback((newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'photos'>, initialPhotos?: string[]) => {
    const caseToAdd: Case = {
      ...newCase,
      id: crypto.randomUUID(),
      notes: [],
      photos: initialPhotos 
        ? initialPhotos.map(dataUrl => ({ id: crypto.randomUUID(), dataUrl, timestamp: new Date() }))
        : [],
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

  const addPhoto = useCallback((caseId: string, dataUrl: string) => {
    setCases(prev =>
      prev.map(c =>
        c.id === caseId
          ? {
              ...c,
              photos: [
                ...c.photos,
                { id: crypto.randomUUID(), dataUrl, timestamp: new Date() },
              ],
              updatedAt: new Date(),
            }
          : c
      )
    );
  }, []);

  const deletePhoto = useCallback((caseId: string, photoId: string) => {
    setCases(prev =>
      prev.map(c =>
        c.id === caseId
          ? {
              ...c,
              photos: c.photos.filter(p => p.id !== photoId),
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
    addPhoto,
    deletePhoto,
    deleteCase,
    getCasesByStage,
  };
}
