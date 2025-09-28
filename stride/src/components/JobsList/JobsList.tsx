// src/components/JobsList/JobsList.tsx

import React from 'react';
// Imports the Job type and JobCard component
import { Job } from '../../hooks/useJobs';
import JobCard from '../JobCard';

interface JobsListProps {
  jobsArray: Job[];
}

const JobsList: React.FC<JobsListProps> = ({ jobsArray }) => {
  // Conditional check: Ensure jobsArray is an array and has items
  if (!Array.isArray(jobsArray) || jobsArray.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No job listings found at this time.</p>
      </div>
    );
  }

  return (
    <div className="job-list-container">
      {jobsArray.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobsList;
