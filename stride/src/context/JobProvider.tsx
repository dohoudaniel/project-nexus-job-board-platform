// src/context/JobProvider.tsx (Example)

import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';
import { Job, JobContext, JobContextType } from './JobContext';

// This assumes Job and JobContextType are defined and exported in JobContext.ts

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const jobsResponse = await axios.get(API_ENDPOINTS.jobs);
      // You may need to fetch sectors here too, if useJobs did that:
      // const sectorsResponse = await axios.get(API_ENDPOINTS.sectors);

      setJobs(jobsResponse.data);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // This value is what consumers of the context will receive
  const contextValue: JobContextType = {
    jobs, // Full list of jobs
    loading,
    error,
    // ... any other state (e.g., sectors)
  };

  return (
    <JobContext.Provider value={contextValue}>{children}</JobContext.Provider>
  );
};
