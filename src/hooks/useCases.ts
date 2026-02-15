import { useState, useEffect, useCallback, useRef } from 'react';
import { Case, CaseStage } from '@/types/case';
import { recompressDataUrl } from '@/lib/imageCompression';
import { MAX_PHOTOS_PER_CASE } from '@/constants';
import { getStoredCases, setStoredCases, isIndexedDBAvailable } from '@/lib/storage';

const LEGACY_STORAGE_KEY = 'servicedesk-cases';

const QUOTA_ERROR_NAMES = ['QuotaExceededError', 'QUOTA_EXCEEDED_ERR'];
function isQuotaError(err: unknown): boolean {
  if (err instanceof DOMException && QUOTA_ERROR_NAMES.includes(err.name))
    return true;
  if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 22)
    return true;
  const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : '';
  return /quota exceeded|quotaexceeded|storage full|disk full|no space left/i.test(msg);
}

function normalizeParsedCases(parsed: any[]): Case[] {
  const now = new Date();
  return parsed.map((c: any) => {
    const createdAt = new Date(c.createdAt);
    const updatedAt = new Date(c.updatedAt);
    return {
      ...c,
      createdAt: Number.isNaN(createdAt.getTime()) ? now : createdAt,
      updatedAt: Number.isNaN(updatedAt.getTime()) ? now : updatedAt,
      notes: (c.notes || []).map((n: any) => {
        const timestamp = new Date(n.timestamp);
        return {
          ...n,
          timestamp: Number.isNaN(timestamp.getTime()) ? now : timestamp,
        };
      }),
      photos: (c.photos || [])
        .slice(0, MAX_PHOTOS_PER_CASE)
        .map((p: any) => {
          const timestamp = new Date(p.timestamp);
          return {
            ...p,
            timestamp: Number.isNaN(timestamp.getTime()) ? now : timestamp,
          };
        }),
    };
  });
}

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastSaveSucceeded = useRef(true);

  // Load cases from IndexedDB (supports 50–100+ cases with 25 photos each). Migrate from localStorage if present.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (isIndexedDBAvailable()) {
          const stored = await getStoredCases();
          if (stored && !cancelled) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              setCases(normalizeParsedCases(parsed));
            }
          }
          // One-time migration: if IDB was empty, load from localStorage and copy to IDB
          if (!stored) {
            try {
              const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
              if (legacy && !cancelled) {
                const parsed = JSON.parse(legacy);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  const normalized = normalizeParsedCases(parsed);
                  setCases(normalized);
                  await setStoredCases(JSON.stringify(normalized));
                  localStorage.removeItem(LEGACY_STORAGE_KEY);
                }
              }
            } catch {
              localStorage.removeItem(LEGACY_STORAGE_KEY);
            }
          }
        } else {
          const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
          if (legacy && !cancelled) {
            const parsed = JSON.parse(legacy);
            if (Array.isArray(parsed)) setCases(normalizeParsedCases(parsed));
          }
        }
      } catch (error) {
        console.error('Failed to load stored cases.', error);
        if (!cancelled) {
          try {
            const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
            if (legacy) {
              const parsed = JSON.parse(legacy);
              if (Array.isArray(parsed)) setCases(normalizeParsedCases(parsed));
            }
          } catch {
            localStorage.removeItem(LEGACY_STORAGE_KEY);
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Save to IndexedDB whenever cases change (no size cap; supports 50–100+ cases with 25 photos each)
  useEffect(() => {
    if (!isLoading) {
      let payload: string;
      try {
        payload = JSON.stringify(cases);
      } catch (err) {
        console.error('Failed to serialize cases:', err);
        return;
      }

      if (isIndexedDBAvailable()) {
        setStoredCases(payload)
          .then(() => {
            lastSaveSucceeded.current = true;
          })
          .catch((err) => {
            if (isQuotaError(err)) {
              console.error('Storage quota exceeded:', err);
              if (lastSaveSucceeded.current) {
                lastSaveSucceeded.current = false;
                window.dispatchEvent(
                  new CustomEvent('servicedesk-storage-error', { detail: err }),
                );
              }
            } else {
              console.error('Failed to save cases:', err);
            }
          });
      } else {
        try {
          localStorage.setItem(LEGACY_STORAGE_KEY, payload);
          lastSaveSucceeded.current = true;
        } catch (err) {
          if (isQuotaError(err)) {
            if (lastSaveSucceeded.current) {
              lastSaveSucceeded.current = false;
              window.dispatchEvent(
                new CustomEvent('servicedesk-storage-error', { detail: err }),
              );
            }
          } else {
            console.error('Failed to save cases:', err);
          }
        }
      }
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
        !Number.isNaN(c.updatedAt?.getTime?.()) &&
        now - c.updatedAt.getTime() > fifteenDaysMs &&
        c.photos?.some((p) => !p.archived),
    );

    if (casesNeedingArchive.length === 0) return;

    let cancelled = false;

    const runArchive = async () => {
      try {
        const updatedCases: Case[] = [];

        for (const c of cases) {
          const updatedTime = c.updatedAt?.getTime?.() ?? 0;
          if (
            c.stage === 'case-closed' &&
            !Number.isNaN(updatedTime) &&
            now - updatedTime > fifteenDaysMs &&
            c.photos?.some((p) => !p.archived)
          ) {
            const updatedPhotos = await Promise.all(
              (c.photos ?? []).map(async (p) => {
                if (p.archived) return p;
                try {
                  const archivedDataUrl = await recompressDataUrl(p.dataUrl);
                  return {
                    ...p,
                    dataUrl: archivedDataUrl,
                    archived: true,
                  };
                } catch {
                  return p;
                }
              }),
            );

            updatedCases.push({ ...c, photos: updatedPhotos });
          } else {
            updatedCases.push(c);
          }
        }

        if (!cancelled) setCases(updatedCases);
      } catch (err) {
        console.error('Archive run failed:', err);
      }
    };

    void runArchive();

    return () => {
      cancelled = true;
    };
  }, [cases, isLoading]);

  const addCase = useCallback((newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'photos'>, initialPhotos?: string[]) => {
    const cappedPhotos = initialPhotos
      ? initialPhotos.slice(0, MAX_PHOTOS_PER_CASE).map((dataUrl) => ({
          id: crypto.randomUUID(),
          dataUrl,
          timestamp: new Date(),
        }))
      : [];
    const caseToAdd: Case = {
      ...newCase,
      id: crypto.randomUUID(),
      notes: [],
      photos: cappedPhotos,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCases((prev) => [...prev, caseToAdd]);
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
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? (c.photos?.length ?? 0) >= MAX_PHOTOS_PER_CASE
            ? c
            : {
                ...c,
                photos: [
                  ...(c.photos ?? []),
                  {
                    id: crypto.randomUUID(),
                    dataUrl,
                    timestamp: new Date(),
                  },
                ],
                updatedAt: new Date(),
              }
          : c,
      ),
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
