// src/context/JobFilterContext.ts

import { createContext } from 'react';
import { Job } from '../hooks/useJobs'; // Import the Job type

// Define the shape of the context state and functions
export interface JobFilterContextType {
  activeFilters: string[];
  // Add the setter function so consumers can update filters
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
  filteredJobs: Job[];
}

// Create the context with default, non-functional values
export const JobFilterContext = createContext<JobFilterContextType>({
  activeFilters: [],
  // Provide a dummy function for the setter
  setActiveFilters: () => {},
  filteredJobs: [],
});
