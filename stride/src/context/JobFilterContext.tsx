// src/context/JobFilterContext.tsx

import React, { createContext, useState, useContext } from 'react';
import { Job } from '../hooks/useJobs'; // Import the Job type

// Define the shape of the context state and functions
interface JobFilterContextType {
  activeFilters: string[];
  filteredJobs: Job[];
  // You will add functions here like applyFilter, clearFilters, etc.
}

// Initial state (or dummy values)
const initialContext: JobFilterContextType = {
  activeFilters: [],
  filteredJobs: [],
};

// Create the context
export const JobFilterContext =
  createContext<JobFilterContextType>(initialContext);

// The Provider component
export const JobFilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  // You will implement logic here to calculate 'filteredJobs' based on 'activeFilters'

  const contextValue: JobFilterContextType = {
    activeFilters,
    filteredJobs: [], // Placeholder for now
  };

  return (
    <JobFilterContext.Provider value={contextValue}>
      {children}
    </JobFilterContext.Provider>
  );
};

// Custom hook to use the filter context easily
export const useJobFilters = () => {
  return useContext(JobFilterContext);
};
