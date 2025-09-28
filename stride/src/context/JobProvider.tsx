// src/context/JobProvider.tsx

import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';
// Ensure JobContext is defined and exported in './JobContext'
import { Job, JobContext, JobContextType } from './JobContext';

// NOTE: We remove the JobFilterContext import since this Provider doesn't manage filters.
// import { JobFilterContext, JobFilterContextType } from './JobFilterContext';

// The JobProvider component
export const JobProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the jobs data
      const jobsResponse = await axios.get(API_ENDPOINTS.jobs);
      setJobs(jobsResponse.data);
    } catch (err) {
      // FIX: Use 'err' in console.error to clear ESLint warning
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load job postings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Value passed to all consumers of the JobContext
  const contextValue: JobContextType = {
    jobs, // Full list of jobs
    loading,
    error,
  };

  return (
    <JobContext.Provider value={contextValue}>{children}</JobContext.Provider>
  );
};
