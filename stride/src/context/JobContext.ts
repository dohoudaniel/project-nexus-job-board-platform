import { createContext } from 'react';

// 1. Define the Job type (based on your db.json)
export interface Job {
  id: string;
  position: string;
  company: string;
  // ... include all other fields used in your job objects
}

// 2. Define the Context Type
export interface JobContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  // You can add your filter state/setter functions here too:
  // filters: string[];
  // setFilters: (filters: string[]) => void;
}

// 3. Define the initial state
const initialContext: JobContextType = {
  jobs: [],
  loading: true,
  error: null,
};

// 4. Export the Context object
export const JobContext = createContext<JobContextType>(initialContext);
