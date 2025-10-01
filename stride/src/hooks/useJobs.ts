// src/hooks/useJobs.ts

import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/apiConfig";

// 1. Define the Job Interface (matches your db.json structure)
export interface Job {
  id: number | string;
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
  salary: string;
  tools: string[];
  category: string;
  categoryLink: string;
  slots: number;
  requirements: string[];
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
        console.error("Data fetch error:", err);
        setError("Failed to fetch job data from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // NOTE: This assumes 'featuredJobs' is a filtered subset of 'jobs'
  const featuredJobs = jobs.filter((job) => job.featured).slice(0, 4);

  // Extract unique locations from jobs
  const locations = Array.from(new Set(jobs.map((job) => job.location))).filter(
    Boolean
  );

  // Extract unique experience levels from jobs
  const experienceLevels = Array.from(
    new Set(jobs.map((job) => job.level))
  ).filter(Boolean);

  return {
    jobs,
    featuredJobs,
    jobSectors,
    locations,
    experienceLevels,
    loading,
    error,
  };
};

// Hook to fetch a single job by ID
export const useJob = (id: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_ENDPOINTS.jobs}/${id}`);
        setJob(response.data);
      } catch (err) {
        console.error("Job fetch error:", err);
        setError("Failed to fetch job details.");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  return { job, loading, error };
};

// Hook to fetch similar jobs by category, excluding the current job
export const useSimilarJobs = (category: string, excludeId: string) => {
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.jobs, {
          params: { category },
        });
        // Filter out the current job and limit to 4 similar jobs
        const filtered = response.data
          .filter((job: Job) => job.id !== excludeId)
          .slice(0, 4);
        setSimilarJobs(filtered);
      } catch (err) {
        console.error("Similar jobs fetch error:", err);
        setSimilarJobs([]);
      }
    };

    if (category && excludeId) {
      fetchSimilarJobs();
    }
  }, [category, excludeId]);

  return { similarJobs };
};

export default useJobs;
