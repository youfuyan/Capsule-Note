// pages/404.js
import { useRouter } from 'next/router';
import styles from '../styles/404.module.css';
import { Button } from 'react-bootstrap';


const NotFound = () => {  

  // Use the useRouter hook to programmatically navigate back to the dashboard
  const router = useRouter();

  return (
    <div className={styles.container}>
        <span className={styles.notFoundH1}>404: Not Found</span>
        <span className={styles.notFoundH2}>Sorry, but we don't have the page you are looking for.</span>
        <Button
          variant='outline-light'
          className={styles.dashboardButton}
          onClick={() => router.push('/dashboard')}
        >
            Go To Dashboard
        </Button>

    </div>
  );
};

export default NotFound;