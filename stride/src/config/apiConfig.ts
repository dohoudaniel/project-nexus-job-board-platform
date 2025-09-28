// src/config/apiConfig.ts

// This relies on VITE_API_BASE_URL=http://localhost:8000 being in your .env file
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  // Endpoints must match the top-level keys in your db.json file
  jobs: `${API_BASE_URL}/jobs`,
  sectors: `${API_BASE_URL}/sectors`,
  users: `${API_BASE_URL}/users`,
  applications: `${API_BASE_URL}/applications`,
};
