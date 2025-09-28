// src/pages/Home.tsx

import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Home.module.css';
import JobListing from '../components/JobListing';
import Container from '../components/Container';
// RE-ADD: You need these components for the logic below
import JobCategoryListing from '../components/JobCategoryListing';
import JobSearch from '../components/JobSearch';
import useJobs from '../hooks/useJobs';
import { Loader } from '../components/Loader';
import { JobFilterProvider } from '../context/JobFilterContext';
import { FaLongArrowAltRight } from 'react-icons/fa';
import MessageDisplayCard from '../components/MessageDisplayCard';
import JobsList from '../components/JobsList/JobsList';

const Home = () => {
  // Note: Removed the underscore prefixes to use the variables naturally
  const { featuredJobs, jobSectors, loading, error, jobs } = useJobs();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  // FIX: Re-introduce the missing function that the component logic relies on
  const handleSearchSelect = (searchParams: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams);
    navigate(`/jobs?${params.toString()}`);
    return;
  };

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
        {successMessage && (
          <MessageDisplayCard
            message={successMessage}
            type="success"
            autoHide
          />
        )}
        <section className={styles.hero}>
          <div className={styles.hero_overlay}>
            <div className={styles.hero_content}>
              <h1>Explore the Latest Job Postings</h1>
              <h3>
                Find your Dream Job / Recruit the best Jobseekers - All in one
                place
              </h3>
              <p>
                Join thousands of JobSeekers and Recruiters connecting on our
                platform.
              </p>
              {/* Re-add JobSearch component */}
              <JobSearch
                jobs={jobs}
                onSearchSelect={handleSearchSelect}
                layoutType="hero"
              />
            </div>
          </div>
        </section>
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

      {/* Re-add Job Categories section to use jobSectors */}
      <Container className="no_pad">
        <section className={styles.home_top_section}>
          <h2>Explore Job Categories</h2>
          <JobCategoryListing listing={jobSectors} />
        </section>
      </Container>

      {/* ... rest of the sections (Stats, Employer CTA, Feedbacks) ... */}
    </div>
  );
};

export default Home;
