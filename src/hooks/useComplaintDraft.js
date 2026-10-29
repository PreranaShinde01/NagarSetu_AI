import { useState, useCallback } from 'react';

const INITIAL_DRAFT = {
  step: 1,
  category: null,
  title: '',
  description: '',
  media: { images: [], videos: [] },
  location: {
    coordinates: [74.4608, 16.6970], // [lng, lat] for Ichalkaranji
    address: 'Station Road, Janata Chowk, Ichalkaranji',
    area: 'Shahapur Textile Hub, Ward 4',
  },
  detectedWard: {
    wardId: 'w-imc-04',
    wardName: 'Prabhag 4 (Janata Chowk / Textile Colony)',
    wardNumber: 4,
    confidence: 0.95,
    source: 'ichalkaranji-gis',
  },
  aiAnalysis: null,
  duplicateCandidates: [],
};

export function useComplaintDraft() {
  const [draft, setDraft] = useState(INITIAL_DRAFT);

  const updateDraft = useCallback((fields) => {
    setDraft((prev) => ({ ...prev, ...fields }));
  }, []);

  const setStep = useCallback((stepNumber) => {
    setDraft((prev) => ({ ...prev, step: stepNumber }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(INITIAL_DRAFT);
  }, []);

  return {
    draft,
    updateDraft,
    setStep,
    resetDraft,
  };
}
