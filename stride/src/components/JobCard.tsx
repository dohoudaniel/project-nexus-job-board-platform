// src/components/JobCard.tsx

import React from 'react';
// Import the Job type defined in your useJobs hook
import { Job } from '../hooks/useJobs';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  // You will fill this in later with the full HTML/Tailwind structure
  // for a single job card. For now, a basic structure is enough.

  return (
    <div
      className="job-card"
      style={{ border: '1px solid #ccc', padding: '15px', margin: '10px' }}
    >
      <h3>{job.position}</h3>
      <p>
        <strong>{job.company}</strong> | {job.location}
      </p>
      <p>
        Level: {job.level} | Contract: {job.contract}
      </p>
      {job.languages.length > 0 && <p>Skills: {job.languages.join(', ')}</p>}
    </div>
  );
};

export default JobCard;
