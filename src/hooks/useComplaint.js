import { useState, useEffect } from 'react';
import { complaintService } from '../services/api/complaintService';

export function useComplaint(id) {
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaint = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await complaintService.getComplaintById(id);
      setComplaint(res.data?.complaint || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch complaint details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  return { complaint, isLoading, error, refetch: fetchComplaint };
}
