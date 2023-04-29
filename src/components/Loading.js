import styles from '../styles/loading.module.css';


export default function Loading() {



    return(
        <div className={styles.loadingContainer}>
            <span className={styles.loadingText}>Loading</span>
            <div className={styles.textContainer}>
            <svg className={styles.loadingDot1} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" />
            </svg>

            <svg className={styles.loadingDot2} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" />
            </svg>
            <svg className={styles.loadingDot3} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" />
            </svg>
            <svg className={styles.loadingDot4} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" />
            </svg>
            <svg className={styles.loadingDot5} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" />
            </svg>
           

                {/* <span className={styles.loadingDot1}>.</span>
                <span className={styles.loadingDot2}>.</span>
                <span className={styles.loadingDot3}>.</span> */}
            </div>
        </div>
    )
}