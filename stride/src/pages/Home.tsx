// src/pages/Home.tsx

import { Link, useLocation, useNavigate } from 'react-router-dom';
// FIX: Add missing imports
import styles from '../styles/Home.module.css';
import JobListing from '../components/JobListing';
import Container from '../components/Container';
import JobCategoryListing from '../components/JobCategoryListing';
import JobSearch from '../components/JobSearch';
import useJobs from '../hooks/useJobs';
import { Loader } from '../components/Loader';
// FIX: Add missing JobFilterProvider import
import { JobFilterProvider } from '../context/JobFilterContext';
import { FaLongArrowAltRight } from 'react-icons/fa';
import MessageDisplayCard from '../components/MessageDisplayCard';
// FIX: Add missing JobsList import
import JobsList from '../components/JobsList/JobsList';
// FIX: Remove unused JobProvider import (assuming you use useJobs, not JobProvider here)
// import { JobProvider } from '../context/JobProvider'; // <-- REMOVE THIS LINE IF IT WAS HERE

const Home = () => {
  // Data is fetched and destructured here
  const { featuredJobs, jobSectors, loading, error, jobs } = useJobs();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  // ... handleSearchSelect function ...

  if (loading) return <Loader />;
  if (error)
    return (
      <MessageDisplayCard
        message={error || 'Unexpected Error. Please Refresh the page.'}
        type="error"
      />
    );

  return (
    <div className={styles.home}>
      <JobFilterProvider>
        {' '}
        {/* FIX: JobFilterProvider is now imported */}
        {/* ... successMessage ... */}
        <section className={styles.hero}>{/* ... hero content ... */}</section>
      </JobFilterProvider>

      <Container className="no_pad">
        <section className={styles.home_top_section}>
          <h2>Top Jobs</h2>
          <JobListing listing={featuredJobs} />

          <Link to="/jobs" className={styles.cta_button}>
            See All Jobs
            <FaLongArrowAltRight />
          </Link>
        </section>
      </Container>

      {/* --- NEW SECTION: Displaying ALL Jobs (Uses JobsList) --- */}
      <Container className="no_pad">
        <section className={styles.home_top_section}>
          <h2>All Job Postings</h2>
          {/* Render the JobsList component and pass the full 'jobs' array */}
          <JobsList jobsArray={jobs} />
        </section>
      </Container>

      {/* ... rest of the sections (Job Categories, Stats, etc.) ... */}
    </div>
  );
};

export default Home;
