import { useState } from 'react';
import { complaintService } from '../services/api/complaintService';

export function useCreateComplaint() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitComplaint = async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await complaintService.createComplaint(payload);
      setIsLoading(false);
      return res.data?.complaint || null;
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to submit complaint.');
      throw err;
    }
  };

  return { submitComplaint, isLoading, error };
}
