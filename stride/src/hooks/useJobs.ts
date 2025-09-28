// src/hooks/useJobs.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';

// 1. Define the Job Interface (matches your db.json structure)
export interface Job {
  id: string;
  company: string;
  logo: string;
  new: boolean;
  featured: boolean;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  description: string;
  requirements: string[];
  salary: string;
  tools: string[];
  slots: number;
  category: string;
  categoryLink?: '?';
}

// 2. Define the Sector Interface (matches your db.json structure)
export interface Sector {
  title: string;
  icon: string;
  link: string;
  count: number;
  id: string;
}

// 3. The useJobs hook (simplified for this example, assumes you handle API_ENDPOINTS import correctly)
const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobSectors, setJobSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch both jobs and sectors concurrently
        const [jobsResponse, sectorsResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.jobs),
          axios.get(API_ENDPOINTS.sectors),
        ]);

        setJobs(jobsResponse.data);
        setJobSectors(sectorsResponse.data);
      } catch (err) {
        console.error('Data fetch error:', err);
        setError('Failed to fetch job data from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // NOTE: This assumes 'featuredJobs' is a filtered subset of 'jobs'
  const featuredJobs = jobs.filter(job => job.featured).slice(0, 4);

  return { jobs, featuredJobs, jobSectors, loading, error };
};

export default useJobs;
