// pages/dashboard.js
import React from "react";
import Link from "next/link";
import styles from "../styles/dashboard.module.css";
import { useClerk } from "@clerk/clerk-react";
import { useAuth, useUser, UserButton, SignIn } from "@clerk/nextjs";

const Dashboard = () => {
  const { signOut } = useClerk();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user, isSignedIn } = useUser();
  return (
    <>
      <Link className="nav-link" href="/" onClick={() => signOut()}>
        Sign out
      </Link>
      <li className={`nav-item`}>
        <a className="nav-link">
          {isLoaded || isSignedIn ? user.primaryEmailAddress.emailAddress : ""}
        </a>
      </li>
      <p></p>
      <div className={styles.dashboardContainer}>
        {/* Other dashboard content */}

        {/* Link to the Note Editor page */}
        <div className={styles.newNoteButton}>
          <Link href="/editor">Create New Note</Link>
        </div>

        {/* Other dashboard content */}
      </div>
    </>
  );
};

export default Dashboard;
