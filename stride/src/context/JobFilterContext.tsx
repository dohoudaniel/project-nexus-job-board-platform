// src/context/JobFilterContext.tsx

import React, { createContext, useState, ReactNode } from "react";
import { Job } from "../hooks/useJobs"; // Import the Job type

// Define the shape of the context state and functions
export interface JobFilterContextType {
  // Search functionality
  searchTerm: { [key: string]: string };
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearchTermChange: (searchParams: { [key: string]: string }) => void;
  clearSearchFilter: () => void;

  // Filter states
  category: string;
  location: string;
  experienceLevel: string;
  role: string;
  position: string;
  company: string;

  // Filter functions
  handleFilterChange: (
    filterType: "category" | "location" | "experienceLevel",
    value: string
  ) => void;
  clearSpecificFilter: (
    filterType: "category" | "location" | "experienceLevel"
  ) => void;
  clearAllFilters: () => void;
  isAnyFilterApplied: boolean;

  // Legacy properties (keeping for backward compatibility)
  activeFilters: string[];
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
  filteredJobs: Job[];
}

// Create the context with default, non-functional values
export const JobFilterContext = createContext<JobFilterContextType>({
  // Search functionality
  searchTerm: {},
  searchInput: "",
  setSearchInput: () => {},
  handleSearchTermChange: () => {},
  clearSearchFilter: () => {},

  // Filter states
  category: "",
  location: "",
  experienceLevel: "",
  role: "",
  position: "",
  company: "",

  // Filter functions
  handleFilterChange: () => {},
  clearSpecificFilter: () => {},
  clearAllFilters: () => {},
  isAnyFilterApplied: false,

  // Legacy properties
  activeFilters: [],
  setActiveFilters: () => {},
  filteredJobs: [],
});

// JobFilterProvider component
export const JobFilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Search state
  const [searchTerm, setSearchTerm] = useState<{ [key: string]: string }>({});
  const [searchInput, setSearchInput] = useState<string>("");

  // Filter states
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [company, setCompany] = useState<string>("");

  // Legacy state
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredJobs] = useState<Job[]>([]);

  // Search functions
  const handleSearchTermChange = (searchParams: { [key: string]: string }) => {
    setSearchTerm(searchParams);
  };

  const clearSearchFilter = () => {
    setSearchTerm({});
    setSearchInput("");
  };

  // Filter functions
  const handleFilterChange = (
    filterType: "category" | "location" | "experienceLevel",
    value: string
  ) => {
    switch (filterType) {
      case "category":
        setCategory(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "experienceLevel":
        setExperienceLevel(value);
        break;
    }
  };

  const clearSpecificFilter = (
    filterType: "category" | "location" | "experienceLevel"
  ) => {
    switch (filterType) {
      case "category":
        setCategory("");
        break;
      case "location":
        setLocation("");
        break;
      case "experienceLevel":
        setExperienceLevel("");
        break;
    }
  };

  const clearAllFilters = () => {
    setCategory("");
    setLocation("");
    setExperienceLevel("");
    setRole("");
    setPosition("");
    setCompany("");
    clearSearchFilter();
  };

  // Check if any filter is applied
  const isAnyFilterApplied = Boolean(
    category ||
      location ||
      experienceLevel ||
      role ||
      position ||
      company ||
      Object.keys(searchTerm).length > 0
  );

  const contextValue: JobFilterContextType = {
    // Search functionality
    searchTerm,
    searchInput,
    setSearchInput,
    handleSearchTermChange,
    clearSearchFilter,

    // Filter states
    category,
    location,
    experienceLevel,
    role,
    position,
    company,

    // Filter functions
    handleFilterChange,
    clearSpecificFilter,
    clearAllFilters,
    isAnyFilterApplied,

    // Legacy properties
    activeFilters,
    setActiveFilters,
    filteredJobs,
  };

  return (
    <JobFilterContext.Provider value={contextValue}>
      {children}
    </JobFilterContext.Provider>
  );
};
